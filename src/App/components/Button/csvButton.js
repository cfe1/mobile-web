import React from "react";
import UploadIcon from "../../assets/icons/upload.png";
import Button from "@material-ui/core/Button";

const CSVButton = ({ onClick, border }) => {
  return (
    <Button onClick={onClick} className="csv-btn" variant="contained" style={{boxShadow:"none",border:border===true?"1px solid #EDECF5":"none"}}>
    <img src={UploadIcon} alt="export" style={{marginRight:"5px"}}/> Export to CSV
    </Button>
      
    
  );
};

export default CSVButton;