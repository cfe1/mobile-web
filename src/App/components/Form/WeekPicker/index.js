import clsx from "clsx";
import React, { PureComponent } from "react";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { createStyles } from "@material-ui/styles";
import { IconButton, withStyles } from "@material-ui/core";
import MyToolbar from "./MyToolbar";
import CalendarIcon from "App/assets/icons/calendarNew.svg";
import moment from "moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import leftArrow from "App/assets/icons/arrowPrev.svg";
import rightArrow from "App/assets/icons/arrowNext.svg";

const StyledPicker = withStyles({
  root: {
    "& label.Mui-focused": {},
    "& .MuiOutlinedInput-root": {
      border: "none",
      // borderRadius: 27,
      borderColor: "#EDECF5",
      padding: "5px 10px",
    },
    fontSize: 13,
    lineHeight: 20 / 13,
    fontWeight: 500,
    display: "none",
  },
})(KeyboardDatePicker);
class CustomElements extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: "",
      open: false,
      today: new Date(),
      start_date: null,
    };
  }

  componentDidMount() {
    if (this.props.weekStartDate) {
      const { weekStartDate } = this.props;
      const startDate = moment(new Date(weekStartDate)).clone().startOf("week");
      const day = `${moment(startDate).format("MMM DD")} - ${moment(
        startDate
      ).format("MMM DD")}, ${moment(startDate).format("YYYY")}`;

      this.setState({ selectedDate: day, start_date: startDate });
      this.props.setWeeEndDate(
        moment(new Date(weekStartDate)).clone().endOf("week")
      );
      this.props.setWeekStartDate(startDate);
    } else {
      const startDate = moment(new Date()).clone().startOf("week");
      const day = `${moment(startDate).format("MMM DD")} - ${moment(
        startDate
      ).format("MMM DD")}, ${moment(startDate).format("YYYY")}`;

      this.setState({ selectedDate: day, start_date: startDate });
      this.props.setWeeEndDate(moment(new Date()).clone().endOf("week"));
      this.props.setWeekStartDate(startDate);
    }
  }

  handleWeekChange = (date) => {
    this.setState({ selectedDate: date.startOf("isoWeek") });
  };

  formatWeekSelectLabel = (date, invalidLabel) => {
    let dateClone = date;

    return dateClone && dateClone.isValid()
      ? `Week of ${dateClone.startOf("isoWeek").format("MMM DD")}`
      : invalidLabel;
  };

  renderWrappedWeekDay = (date, selectedDate, dayInCurrentMonth) => {
    const { classes } = this.props;

    let dateClone = date.clone();
    let selectedDateClone = selectedDate.clone();

    const start = selectedDateClone.startOf("week").toDate();
    const end = selectedDateClone.endOf("week").toDate();

    const dayIsBetween = dateClone.isBetween(start, end, null, []);
    const isFirstDay = dateClone.isSame(start, "day");
    const isLastDay = dateClone.isSame(end, "day");

    const wrapperClassName = clsx({
      [classes.highlight]: dayIsBetween,
      [classes.firstHighlight]: isFirstDay,
      [classes.endHighlight]: isLastDay,
    });

    const dayClassName = clsx(classes.day, {
      [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
      [classes.highlightNonCurrentMonthDay]: !dayInCurrentMonth && dayIsBetween,
    });

    return (
      <div>
        <div className={wrapperClassName}>
          <IconButton className={dayClassName}>
            <span>{dateClone.format("DD")}</span>
          </IconButton>
        </div>
      </div>
    );
  };

  toggleOpen = () => this.setState({ open: !this.state.open });
  dateTxt = () => {
    const { start_date } = this.state;
    return `${moment(start_date).format("MMM DD, YYYY")} - ${moment(start_date)
      .endOf("week")
      .format("MMM DD, YYYY")}`;
  };

  getMaxDate = () => {
    return moment(new Date())
      .clone()
      .subtract(1, "weeks")
      .endOf("isoWeek")
      .subtract(1, "d");
  };
  handleSetStates = () => {
    this.props.setWeeEndDate(
      moment(this.state.start_date).clone().endOf("week")
    );
    this.props.setWeekStartDate(this.state.start_date);
  };

  onChange = (value) => {
    this.setState(
      {
        today: value,
        start_date: value.startOf("week"),
      },
      () => this.handleSetStates()
    );
  };

  handleLeftArrowClick = () => {
    this.setState(
      {
        start_date: moment(this.state.start_date).add(-7, "d"),
      },
      () => this.handleSetStates()
    );
  };

  handleRightArrowClick = () => {
    this.setState(
      {
        start_date: moment(this.state.start_date).add(7, "d"),
      },
      () => this.handleSetStates()
    );
  };
  render() {
    const { classes, disableFromCureentWeek } = this.props;
    const { open } = this.state;
    const { start_date } = this.state;
    return (
      <>
        <div className={classes.flex}>
          <div className={`${classes.flex} ${classes.dateContainer}`}>
            <img
              className={classes.arrow}
              src={leftArrow}
              alt=""
              onClick={this.handleLeftArrowClick}
              // onClick={() => setToday(moment(today).subtract(7, "d"))}
            />
            <div className={classes.wpicker}>
              <span className={classes.dateTxt}>{this.dateTxt()}</span>
            </div>

            <img
              className={classes.arrow}
              src={rightArrow}
              alt=""
              onClick={this.handleRightArrowClick}
              // onClick={() => setToday(moment(today).add(7, "d"))}
            />
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <StyledPicker
                open={open}
                //label="Week picker"
                value={start_date}
                onChange={this.onChange}
                renderDay={this.renderWrappedWeekDay}
                ToolbarComponent={MyToolbar}
                underlineStyle={{ display: "none" }}
                InputProps={{
                  disableUnderline: true,
                }}
                onClose={this.toggleOpen}
              />{" "}
            </MuiPickersUtilsProvider>
          </div>
          <div className={classes.calendarDiv}>
            <img
              src={CalendarIcon}
              className={classes.calendarImg}
              alt=""
              onClick={this.toggleOpen}
            />
          </div>
        </div>
      </>
    );
  }
}

const styles = createStyles((theme) => ({
  dayWrapper: {
    position: "relative",
  },
  day: {
    width: 36,
    height: 36,
    fontSize: theme.typography.caption.fontSize,
    margin: "0 2px",
    color: "inherit",
  },
  customDayHighlight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "2px",
    right: "2px",
    border: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: "50%",
  },
  nonCurrentMonthDay: {
    color: theme.palette.text.disabled,
  },
  highlightNonCurrentMonthDay: {
    color: "#676767",
  },
  highlight: {
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  endHighlight: {
    extend: "highlight",
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
  },
  firstHighlight: {
    extend: "highlight",
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%",
  },
  dateTxt: {
    fontSize: 20,
    fontWeight: 700,
    // width: "fit-content",
  },
  yearTxt: {
    fontSize: 18,
    fontWeight: 500,
  },
  wpicker: {
    padding: "2px",
    background: "white",
    display: "flex",
    height: 35,
    alignItems: "center",
  },
  flex: {
    display: "flex",
    alignItems: "center",
  },
  arrow: {
    cursor: "pointer",
  },
  dateContainer: {
    background: "white",
    justifyContent: "space-between",
    width: "300px",
    borderRadius: "8px",
    height: "44px",
    width: "320px",
  },
  calendarDiv: {
    background: "white",
    width: "44px",
    height: "44px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    marginLeft: 20,
  },
  calendarImg: {
    width: "62%",
  },
}));

export default withStyles(styles)(CustomElements);
