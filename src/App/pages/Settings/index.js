import React, { Component } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { Link as Route } from "react-router-dom";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "../pages.scss";
import ChangePassword from "./components/changePassword";
import NotificationManagement from "./components/notificationManagement";
import Overtime from "./components/overtimeSetting";
import PaidTimeOff from "./components/paidTimeOff";
import TaxBank from "./components/taxBank";
import { Tooltip } from "../../components";
import AgaliaInfo from "./components/agaliaInfo";


export class Settings extends Component {
  state = {
    bankExpanded: false,
  };

  componentDidMount = () => {
    if (
      this.props.location.search.includes("bank") ||
      this.props.location?.state?.content?.type === "bank"
    ) {
      this.setState({ bankExpanded: true }, () => {});
    }
  };
  render() {
    return (
      <>
        <div className="module-nav">
          <div className="mls">
            <div className="module-title">Settings</div>
            <div className="module-breadcrumb">
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                <Link color="inherit" component={Route} to={"/"}>
                  Agalia
                </Link>
                <Typography style={{ color: "#9C00BA" }}>Settings</Typography>
              </Breadcrumbs>
            </div>
          </div>
          <div className="mrs"></div>
        </div>
        <div className="sett-info">
          <div className="sett-acc">
            <Accordion
              defaultExpanded={
                this.props.location.search.includes("bank") ||
                this.props.location?.state?.content?.type === "bank"
                  ? true
                  : undefined
              }
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{ color: "#17174A" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Bank Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="sett-acc-details">
                  <TaxBank></TaxBank>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="sett-acc">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{ color: "#17174A" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Notification Management</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="sett-acc-details">
                  <NotificationManagement></NotificationManagement>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="sett-acc">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{ color: "#17174A" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Change Password</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="sett-acc-details">
                  <ChangePassword history={this.props.history}></ChangePassword>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="sett-acc">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{ color: "#17174A" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography style={{ marginRight: 10 }}>
                  Overtime Settings
                </Typography>
                <Tooltip
                  title={
                    <>
                      <span className="c1">
                        <b> Note that:</b> Overtime must be paid at a wage rate
                        of 150% of their regular hourly rate for hours that
                        exceed 40 in a week.
                      </span>
                    </>
                  }
                  position="bottom"
                  trigger="click hover focus"
                  info
                />
              </AccordionSummary>
              <AccordionDetails>
                <div className="sett-acc-details">
                  <Overtime></Overtime>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="sett-acc">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{ color: "#17174A" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Paid Time Off Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="sett-acc-details">
                  <PaidTimeOff></PaidTimeOff>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="sett-acc">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{ color: "#17174A" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Agalia Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="sett-acc-details">
                  <AgaliaInfo></AgaliaInfo>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </>
    );
  }
}

export default Settings;
