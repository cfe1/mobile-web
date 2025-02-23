import React, { Component } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { Link as Route } from "react-router-dom";
import icon1 from "../../assets/images/404.svg";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import "../pages.scss";
import { withStyles } from "@material-ui/core/styles";
import { Loader, PrimaryButton } from "../../components";

const styles = {
  base: {
    color: "#9C00BA",
    fontWeight: 400,
    textTransform: "capitalize",
  },

  card1: {
    borderRadius: "10px !important",
  },

  card2: {
    marginTop: "15%"
  },

  card3: {
    marginTop: "2%",
    color: "black",
    fontSize: 30,
    fontWeight: 700,
  },

  card4: {
    marginTop: "0.5%",
    marginBottom: "3%",
    fontSize: 17,
    fontWeight: "regular",
    color: "#82889C",
  },
  card5: {
    marginBottom: "100px"
  },
  card6: {
    height: 48
  }
};

export class PageNotFound extends Component {
  state = {
    loading: false,
  };

  render() {
    const { loading } = this.state;
    const { classes } = this.props;
    return (
      <>
        <div className="module-nav">
          <div className="mls">
            <div className="module-title">Page Not Found</div>
            <div className="module-breadcrumb">
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                <Link
                  color="inherit"
                  component={Route}
                  to={"/"}
                  onClick={this.navigateTo}
                >
                  Agalia
                </Link>
                <Link
                  color="inherit"
                  component={Route}
                  to={"/dashboard"}
                  onClick={this.navigateTo}

                  className={classes.base}
                >
                  Dashboard
                </Link>
              </Breadcrumbs>
            </div>
          </div>
        </div>
        <Paper>
          <div className={`fc-container ${classes.card1}`} >
            {loading && <Loader />}
            <div>
              <div>
                <div >
                  <Grid container justify="center" align="center">
                    <Grid
                      item
                      xs={12}
                      align="center"
                      className={classes.card2}
                    >
                      <img src={icon1} alt="404"></img>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      align="center"
                      className={classes.card3}
                    >
                      404 Error!
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      align="center"
                      className={classes.card4}
                    >
                      The page you requested can not be found.But don't <br />{" "}
                      worry you can find plenty of things on our dashboard.
                    </Grid>
                    <Grid align="center" className={classes.card5}>
                      <Link
                        component={Route}
                        to={"/dashboard"}
                        onClick={this.navigateTo}
                      >
                        <PrimaryButton
                          variant="contained"
                          color="primary"

                          className={classes.card6}
                          onClick={this.navigateTo}
                        >
                          Go to Dashboard
                        </PrimaryButton>
                      </Link>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </>
    );
  }
}

export default withStyles(styles)(PageNotFound);
