import React from "react";
import Button from "@material-ui/core/Button";

const RejectButton = ({ onClick }) => {
  return (
    <Button onClick={onClick} className="reject-btn" variant="contained" style={{boxShadow:"none"}}>
     Reject
    </Button>
      
    
  );
};

export default RejectButton;