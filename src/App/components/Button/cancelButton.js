import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import { Clear } from "@material-ui/icons";

export class CancelButton extends Component {
  render() {
    return (
      <div className="cancel-btn-container">
        <IconButton aria-label="delete" className="cancel-btn" size="large" onClick={this.props.onClick}>
          <Clear fontSize="inherit" />
        </IconButton>
      </div>
    );
  }
}

export default CancelButton;
