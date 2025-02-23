import React from "react";
import TableSortLabel from "@material-ui/core/TableSortLabel";

import TableSortIcon from "../../assets/icons/table-sort-default.svg";
import TableSortAscIcon from "../../assets/icons/table-sort-asc.svg";
import TableSortDescIcon from "../../assets/icons/table-sort-desc.svg";

const getSortIcon = (active, direction) => {
  if (active === false) {
    return TableSortIcon;
  } else {
    if (direction === "asc") {
      return TableSortAscIcon;
    } else if (direction === "desc") {
      return TableSortDescIcon;
    }
  }
};

const TableSort = ({ active, direction }) => {
  return (
    <TableSortLabel
      active={active}
      direction={direction}
      style={{ marginLeft: 5 }}
      IconComponent={() => <img src={getSortIcon(active, direction)} />}
    />
  );
};

export default TableSort;
