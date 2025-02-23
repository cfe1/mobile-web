import React from "react";
import Button from "@material-ui/core/Button";

const ApproveButton = ({ onClick }) => {
  return (
    <Button onClick={onClick} className="approve-btn" variant="contained" style={{boxShadow:"none"}} >
    Approve
    </Button>
      
    
  );
};

export default ApproveButton;