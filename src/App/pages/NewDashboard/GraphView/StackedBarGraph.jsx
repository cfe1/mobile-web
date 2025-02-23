import { useWindowSize } from "App/hooks";
import React, { useEffect, useState, useRef } from "react";
import { API, ENDPOINTS } from "api/apiService";
import queryString from "query-string";
import moment from "moment";
import { Loader } from "App/components";
import DrawerSearchInput from "App/components/Form/DrawerSearchInput";

import { Grid, makeStyles, Typography } from "@material-ui/core";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { apiErrorHandler } from "utils/apiUtil";
import { formatAmount, formatHours } from "utils/textUtils";

const NewCustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const facilityData = payload[0]?.payload;
  if (!facilityData) return null;

  const dataPoints = [
    { label: "Actual Hours", value: formatHours(facilityData.regular_hours) },
    {
      label: "Actual Overtime",
      value: formatHours(facilityData.regular_overtime),
    },
    { label: "Actual Spend", value: formatAmount(facilityData.actual_spend) },
    {
      label: "Scheduled Hours",
      value: formatHours(facilityData.scheduled_hours),
    },
    {
      label: "Scheduled Overtime",
      value: formatHours(facilityData.scheduled_overtime),
    },
    {
      label: "Scheduled Spend",
      value: formatAmount(facilityData.confirmed_spend),
    },
    { label: "Posted Hours", value: formatHours(facilityData.posted_hours) },
  ];

  return (
    <div className="custom-tooltip">
      {dataPoints.map(({ label, value }, index) => (
        <>
          <div
            key={label}
            className="flex flex-nowrap items-center gap-10 label-cont justify-between"
          >
            <span className="tooltip-label"> {label}: </span>
            <span className="tooltip-value">{value}</span>
          </div>
          {(index === 2 || index === 5) && (
            <div className="h-divider w-full"></div>
          )}
        </>
      ))}
    </div>
  );
};

const CustomizedAxisTick = (props) => {
  const { x, y, payload, totalItems } = props;
  const numLines = 3;
  const lineSpacing = 20;
  const leftTextOffset = -80;

  const maxLength = 24;
  const text = payload?.value || "";

  // To break the name of facilities into multiple lines.
  // Done so because of the svg, no option to wrap the text.
  // And we had alloted fixed width to the Y-axis component.
  const breakIntoLines = (str, maxLen) => {
    const words = str.split(" ");
    const lines = [];
    let currentLine = "";

    words.forEach((word) => {
      if ((currentLine + word).length <= maxLen) {
        currentLine += (currentLine ? " " : "") + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const lines = breakIntoLines(text, maxLength);

  let spaceBtwText = 13;
  if (totalItems === 1) {
    spaceBtwText = 2;
  } else if (totalItems === 2) {
    spaceBtwText = 7;
  }
  return (
    <>
      <g transform={`translate(${x},${y - 2 - payload?.offset / 2})`}>
        <text
          x={leftTextOffset}
          y={(numLines - 1) * (lineSpacing / 2) + 4}
          textAnchor="end"
          fill="#929AB3"
          fontSize={14}
          fontWeight={700}
        >
          {lines.map((line, index) => (
            <tspan
              key={index}
              x={leftTextOffset}
              dy={index === 0 ? 8 : "1.2em"}
            >
              {line}
            </tspan>
          ))}
        </text>

        {["Actual", "Scheduled", "Posted"].map((item, index) => (
          <text
            key={index}
            x={0}
            y={spaceBtwText * index}
            dy={index * lineSpacing}
            textAnchor="end"
            fill="#929AB3"
            fontSize={12}
            alignmentBaseline={"middle"}
          >
            {`${item}`}
          </text>
        ))}
      </g>
    </>
  );
};

export const StackedBarGraph = ({ startDate, endDate }) => {
  const [facilities, setFacilities] = useState([]);
  const [search, setSearch] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetFacilitiesData = async () => {
    try {
      setLoading(true);
      const params = {
        page_size: 100,
        page: 1,
      };

      if (search) {
        params.search = search;
      }

      const urlParams = queryString.stringify(params);
      const startDateF = moment(startDate).format("YYYY-MM-DD");
      const endDateF = moment(endDate).format("YYYY-MM-DD");

      const response = await API.get(
        ENDPOINTS.FETCH_FACILITIES(startDateF, endDateF, urlParams)
      );

      if (response.success) {
        setFacilities(response?.data);
      }
    } catch (e) {
      apiErrorHandler(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate) handleGetFacilitiesData();
  }, [search, startDate, endDate]);

  const GRAPH_DATA = facilities?.results?.map((facility) => {
    const {
      id,
      name,
      posted_hours,
      scheduled_hours,
      actual_hours,
      overtime_hours,
      confirmed_spend,
      actual_spend,
      scheduled_overtime_hours = 0,
    } = facility || {};

    return {
      id,
      name,
      posted_hours: Number(posted_hours || 0),
      scheduled_hours: Number(scheduled_hours || 0),
      scheduled_overtime: Number(scheduled_overtime_hours || 0),
      regular_hours: (
        Number(actual_hours || 0) - Number(overtime_hours || 0)
      ).toFixed(2),
      regular_overtime: Number(overtime_hours),
      confirmed_spend,
      actual_spend,
    };
  });

  const handleClick = (data, index) => {
    // console.log(data, index);
  };

  // <==================== Static X-Axis =============================================>

  // Needed to make the xAxis of the graph sticky.
  // Steps Taken :
  // 1. Target the graph xAxis using the ref from the container created.
  // 2. Then copy it into state and pass it to dangerouslySetInnerHTML.
  // 3. Then use setTimeout for copying the data correctly.
  const graphWrapperRef = useRef(null);
  const [axisHtml, setAxisHtml] = useState(null);
  const { width } = useWindowSize() || {};

  useEffect(() => {
    // Wrote this since the graph was taking time as the width was changing
    // Therefore we need to copy after the graph has adjusted to the width
    // and rendered. Otherwise the width of the x-Axis would not match to
    // the actual graph.
    setTimeout(() => {
      if (graphWrapperRef.current) {
        const targetElement =
          graphWrapperRef.current.querySelector(".recharts-xAxis");
        if (targetElement) {
          const htmlContent = targetElement.innerHTML;
          setAxisHtml(htmlContent);
        }
      }
    }, 300);
  }, [width, GRAPH_DATA]);

  const classes = useStyles();
  return (
    <>
      {loading && <Loader />}
      <Grid
        className="mt-10"
        container
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography className={`${classes.title1}`}>
          You have
          <span className={classes.pinkColor}>{` ${
            facilities?.count || 0
          } `}</span>
          Facilities
        </Typography>
        <DrawerSearchInput
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          label={`Search Facility`}
          widthClass={classes.searchWidth}
        />
      </Grid>

      <div className="mt-10 mb-10 flex items-center legend-container gap-10 w-fit">
        {["Regular", "Overtime"].map((type, index) => (
          <div key={type} className="flex items-center gap-10">
            <div
              className={`legend-color-cont bg-${
                index === 0 ? "lt" : "main"
              }-pink`}
            ></div>
            <span className="text-12">{type}</span>
          </div>
        ))}
      </div>
      {GRAPH_DATA?.length > 0 && (
        <div className="sticky-x-axis-container">
          <svg
            width={10000}
            height={50}
            dangerouslySetInnerHTML={{ __html: axisHtml }}
          />
        </div>
      )}

      <div className="graph-wrapper" ref={graphWrapperRef}>
        {GRAPH_DATA?.length > 0 && (
          <ResponsiveContainer
            width={"99%"}
            height={130 * facilities?.results?.length}
          >
            {/* Fixing 130 height for each facility data */}
            <BarChart
              data={GRAPH_DATA}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              layout="vertical"
              barCategoryGap="10%"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <YAxis
                tick={<CustomizedAxisTick totalItems={GRAPH_DATA?.length} />}
                dataKey="name"
                type="category"
                name="Hours"
                width={250}
                fontSize={16}
                tickLine={false}
                stroke="black"
              />
              <XAxis
                type="number"
                orientation="top"
                padding={{ left: 2 }}
                axisLine={false}
                unit={" Hrs"}
              />
              <Tooltip
                content={<NewCustomTooltip />}
                cursor={{ fill: "transparent" }}
                shared={false}
              />
              <Bar
                label="2334"
                dataKey="regular_hours"
                stackId="a"
                fill="#FFE3F2"
                onClick={handleClick}
              ></Bar>
              <Bar dataKey="regular_overtime" stackId="a" fill="#FF0083"></Bar>
              <Bar dataKey="scheduled_hours" fill="#FFE3F2" stackId="b"></Bar>
              <Bar
                dataKey={"scheduled_overtime"}
                fill="#FF0083"
                stackId="b"
              ></Bar>
              <Bar dataKey="posted_hours" fill="#FFE3F2"></Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  title1: {
    fontSize: 26,
    fontWeight: 700,
    "@media (min-width:1279px)": {
      fontSize: 22,
    },
  },
  pinkColor: {
    color: theme.palette.primary.main,
  },
  filterAndSearch: {
    marginTop: 16,
  },
  searchWidth: {
    width: 380,
  },
}));
