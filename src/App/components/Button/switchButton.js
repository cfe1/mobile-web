import React, { Component, Fragment } from "react";
import Switch from "react-switch";

class SwitchButton extends Component {
  state = {
    active: false,
  };
  handleChange = (e) => {
    this.setState({ active: e });
    
  };
  componentDidMount=()=>{
    this.setState({active:this.props.value})
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
     active: nextProps.value,
    };
   }
 
  render() {
    return (
      <Fragment>
        <Switch
          onColor={this.props.color?this.props.color:"#00D498"}
          offColor="#EDECF5"
          onHandleColor="#FFFFFF"
          handleDiameter={19.50}
          uncheckedIcon={false}
          checkedIcon={false}
          
          height={24}
          width={45.80}
          onChange={(e) => {
            this.handleChange(e);
            
            this.props.onChange(e)
            
          }}
          checked={this.state.active}
        />
      </Fragment>
    );
  }
}

export default SwitchButton;
