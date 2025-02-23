import React from "react";
import EditIcon from "../../assets/images/edit-icon.png";
import Button from "@material-ui/core/Button";

const EditButton = ({ onClick, color }) => {
  return (
    <Button onClick={onClick} className={color==="white"?"edit-btn-w":"edit-btn"} variant="contained" style={{boxShadow:"none", }}>
    <img src={EditIcon} alt="export" style={{marginRight:"5px",}}/> Edit
    </Button>
      
    
  );
};

export default EditButton;