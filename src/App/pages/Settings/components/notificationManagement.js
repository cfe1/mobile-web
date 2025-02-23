import React, { Component } from "react";
import Switch from "react-switch";
import { Axios } from "../../../../api/apiConsts";
import { Toast } from "../../../components";

export class NotificationManagement extends Component {
  state = {
    active: false,
    loading: false,
  };

  componentDidMount = () => {
    this.getProfileDetails();
  };

  getProfileDetails = () => {
    this.setState({ loading: true });
    Axios.get("facilities/manager/profile")
      .then((response) => {
        this.setState({ loading: false });
        if (response.data.statusCode === 200) {
          
          this.setState(
            { active: response.data.data.is_notification_enable },
            () => {}
          );
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };
  handleChange = (e) => {
    this.updateNotification(e);
  };

  updateNotification = (e) => {
    this.setState({ loading: true });

    const packet = {
      is_notification_enable: e,
    };
    Axios.patch(`facilities/manager/profile`, packet)
      .then((response) => {
        this.setState({ loading: false, active: e });
        if (response.data.statusCode === 200) {
          Toast.showInfoToast("Notification Setting Updated Successfully.");
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        
        if (error.response.status !== 500) {
          if ([400,405,422,403].includes(error.response.data.statusCode)) {
            Toast.showErrorToast(error.response.data.error.message[0]);
          }
        }
      });
  };

  render() {
    return (
      <div>
        <div className="sett-notification">
          <div className="sett-notification-title">
            Toggle to enable or disable notifications.
          </div>
          <div className="sett-notification-switch">
            <Switch
              onColor="#050D33"
              offColor="#EDECF5"
              onHandleColor="#FFFFFF"
              handleDiameter={19.5}
              uncheckedIcon={false}
              checkedIcon={false}
              height={24}
              width={45.8}
              onChange={(e) => {
                this.handleChange(e);
              }}
              checked={this.state.active}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default NotificationManagement;
