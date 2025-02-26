import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import IconButton from "@material-ui/core/IconButton";
import { FormControl, Select } from "@material-ui/core";

import BackAllIcon from "../../assets/icons/pagination-back-all.svg";
import BackOneIcon from "../../assets/icons/pagination-back-previous.svg";
import NextAllIcon from "../../assets/icons/pagination-next-all.svg";
import NextOneIcon from "../../assets/icons/pagination-next.svg";

function TablePagination({
  count,
  page,
  rowsPerPage,
  setRowsPerPage,
  onChangePage,
}) {
  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 1);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(1, Math.ceil(count / rowsPerPage)));
  };

  return (
    <Grid
      container
      justify="flex-end"
      alignItems="center"
      style={{ marginTop: 10, marginBottom: 10 }}
    >
      {setRowsPerPage && (
        <div className="row-center mr-2">
          <span className="c1 mr-1">Rows per page: </span>
          <FormControl variant="outlined" style={{ width: 70 }}>
            <Select
              native
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(e.target.value);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </Select>
          </FormControl>
        </div>
      )}
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 1}
        aria-label="first page"
        edge="end"
      >
        <img src={BackAllIcon} alt="" />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 1}
        aria-label="previous page"
      >
        <img src={BackOneIcon} alt="" />
      </IconButton>
      <Typography variant="button" style={{ margin: 10 }}>
        {page}
      </Typography>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage)}
        aria-label="next page"
        edge="end"
      >
        <img src={NextOneIcon} alt="" />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage)}
        aria-label="last page"
      >
        <img src={NextAllIcon} alt="" />
      </IconButton>
      {count < 1 ? (
        <Typography
          variant="body2"
          className="text-muted"
          style={{ marginLeft: 10, marginRight: 20 }}
        >
          0 items
        </Typography>
      ) : (
        <Typography
          variant="body2"
          className="text-muted"
          style={{ marginLeft: 10, marginRight: 20 }}
        >
          Showing
          <b>
            {(page - 1) * rowsPerPage + 1} -
            {Math.min(count, page * rowsPerPage)}
          </b>
          of {count} items
        </Typography>
      )}
    </Grid>
  );
}

export default TablePagination;
