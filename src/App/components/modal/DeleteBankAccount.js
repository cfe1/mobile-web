import React, { Component } from "react";
import Modal from "@material-ui/core/Modal";
import { PrimaryButton, SecondaryButton, } from "../../components";
import Delete from "../../assets/icons/delete.svg";
import { withStyles } from "@material-ui/core/styles";
import Loader from "../Loader";
const styles={};

export class DeleteBankAccount extends Component {
  state = {
    open: false,
    icon:null
  };

  handleClose = () => {
    this.setState({ open: false });
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
        <div className="modal-content" style={{height : "440px",}}>
            {this.props.loading && <Loader />}
          <div className="modal-icon" style={{marginTop:60}}>
            <img src={Delete} alt="delete icon" />
          </div>
          <div className="modal-heading">{this.props.heading}</div>
          <div className="modal-sub-heading">{this.props.subHeading}</div>
          <div className="modal-cta">
            
            <SecondaryButton
              variant="contained"
              style={{ height: 54, marginRight: 16,display:this.props.hideCancelBtn===true?"none":"block" }}
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
              {this.props.hideCancelBtn===true?"Close":"Confirm"}
            </PrimaryButton>
          </div>
        </div>
      </Modal>
    );
  }
}

export default withStyles(styles)(DeleteBankAccount);
