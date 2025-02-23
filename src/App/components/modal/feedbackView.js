import React, { Component } from "react";
import Modal from "@material-ui/core/Modal";
import { SecondaryButton } from "../../components";
import { withStyles } from "@material-ui/core/styles";


const styles = {
  base:{
    width:"50% !important",
    margin:"auto",
    ['@media (max-width:1024px)']: {
      width: '80% !important'
    },
    borderRadius: 16,
    backgroundColor: "white",
    outline: "none",
  },
  heading: {
    color: "#82889C !important",
    fontFamily: "Manrope",
    fontSize: "32px",
    fontWeight: 600,
    marginTop: "25px !important",
    textAlign: "center",
    marginBottom: 12,
  },
  modalCta:{
    backgroundColor: '#f5f6fa',
    height: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  title: {
    color: "#82889C",
    fontFamily: "Manrope",
    fontSize: "13px",
    fontWeight: 600,
    marginLeft: 20,
  },
  desc: {
    color: "#050D33",
    fontFamily: "Manrope",
    fontSize: "13px",
    fontWeight: 500,
    paddingLeft: 20,
    paddingRight: 50,
    marginTop: 7,
  },
  divider: {
    height: 15,
  },
};

export class FeedbackView extends Component {
  state = {
    open: false,
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <Modal
        className={`modal-container`}
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        onBackdropClick={this.props.handleClose}
      >
        <div className={classes.base}>
          <div className={classes.heading}>
            Feedback Detail
          </div>

          <div className={classes.title}>Feedback Title</div>
          <div className={classes.desc}>{this.props.heading}</div>
          <div className={classes.divider}></div>
          <div className={classes.title}>Feedback Description</div>
          <div className={classes.desc}>{this.props.subHeading}</div>
          <div className={classes.divider}></div>
          <div className={classes.divider}></div>

          <div className={classes.modalCta}>
            <SecondaryButton
              variant="contained"
              style={{ height: 54, marginRight: 16 }}
              onClick={this.props.handleClose}
            >
              Close
            </SecondaryButton>
          </div>
        </div>
      </Modal>
    );
  }
}

export default withStyles(styles)(FeedbackView);
