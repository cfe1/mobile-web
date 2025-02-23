import React, { Component } from "react";
import Modal from "@material-ui/core/Modal";


export class GalleryModal extends Component {
  state = {
    open: false,
  };

  handleClose = () => {
    this.setState({ open: false });
  };


  componentDidMount=()=>{
  }
  

  render() {
    return (
      <Modal
        className="g-modal-container"
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        onBackdropClick={this.props.handleClose}
      >
        <div className="g-modal-content">
         {this.props.children}
         </div>
      </Modal>
    );
  }
}

export default GalleryModal;
