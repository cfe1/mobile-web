import React, { Component } from "react";
import Modal from "@material-ui/core/Modal";
import { PrimaryButton, SecondaryButton, InputField } from "../../components";
import Delete from "../../assets/icons/delete.svg";
import Block from "../../assets/icons/block.svg";
import Success from "../../assets/icons/popup-success.svg";
import Alert from "../../assets/icons/alert.svg";
import { Grid } from "@material-ui/core";

export class mainModal extends Component {
  state = {
    open: false,
    icon: null,
    feedback: "",
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleIcon = () => {
    let key = this.props.type;
    switch (key) {
      case "delete":
        this.setState({ icon: Delete });
        break;
      case "block":
        this.setState({ icon: Block });
        break;
      case "success":
        this.setState({ icon: Success });
        break;
      case "alert":
        this.setState({ icon: Alert });
        break;
      default:
        break;
    }
  };

  componentDidMount = () => {
    this.handleIcon();
  };

  render() {
    return (
      <Modal
        className="modal-container"
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        onBackdropClick={this.props.handleClose}
      >
        <div className="modal-content">
          <div className="modal-icon">
            <img src={this.props.icon} alt="icon" />
          </div>
          <div className="modal-heading">{this.props.heading}</div>
          <div className="modal-sub-heading">{this.props.subHeading}</div>
          {this.props.feedbackRequired && (
            <Grid container justify="center" style={{}}>
              <Grid item xs={10}>
                <InputField
                  id="feedback"
                  type="text"
                  multiline
                  rows={3}
                  inputProps={{ maxLength: 150 }}
                  label="Feedback (optional)"
                  variant="outlined"
                  value={this.props.feedback}
                  onChange={(event) => this.props.feedbackChangeHandler(event)}
                  helperText={`${this.props.feedback.length}/150`}
                  heleperTextRight
                  fullWidth
                />
              </Grid>
            </Grid>
          )}
          <div className="modal-cta">
            <SecondaryButton
              variant="contained"
              style={{
                height: 54,
                marginRight: 16,
                display: this.props.hideCancelBtn === true ? "none" : "block",
              }}
              onClick={this.props.handleClose}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              variant="contained"
              color="primary"
              style={{ height: 54 }}
              onClick={this.props.confirm}
            >
              {this.props.hideCancelBtn === true ? "Close" : "Confirm"}
            </PrimaryButton>
          </div>
        </div>
      </Modal>
    );
  }
}

export default mainModal;
