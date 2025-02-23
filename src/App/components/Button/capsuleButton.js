import React from "react";
import Button from "@material-ui/core/Button";

const CapsuleButton = ({ onClick, color, label }) => {
  return (
    <Button onClick={onClick} className={color==="white"?"edit-btn-w":"edit-btn"} variant="contained" style={{boxShadow:"none",width:"120px" }}>
     {label}
    </Button>
      
    
  );
};

export default CapsuleButton;