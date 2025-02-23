import React,{Component} from "react";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { withStyles } from '@material-ui/styles';
import { PrimaryButton,InputField,
  Dropdown,
  CancelButton,
  Modal,
  PhoneInputField,Loader,Toast, DeleteModal,SuccessModal } from "../../../components";
import Step from "./Step";
import UploadIcon from "../../../assets/icons/upload-image.png";
import DefaultImage from "../../../assets/icons/profile_default.svg";
import "../../pages.scss";
import { FormControl, InputLabel, MenuItem } from "@material-ui/core";
import { Axios } from "../../../../api/apiConsts";
import moment from "moment";
import Avatar from "react-avatar-edit";

const styles = theme=>({
  root: {},
  main: { display: "flex", flexDirection: "row", flex: 1 },
  sidebar: {
    width: 280,
    backgroundColor: "#090930",
    color: "white",
    paddingTop: 140,
  },
  content: {
    padding: "50px 30px",
    width: "100%",
    overflowY: "scroll",
  },
  documentPlaceholder: {
    backgroundColor: "#F5F6FA",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  downloadLinkContainer: {
    alignSelf: "center",
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: "12px 15px 12px 15px",
    cursor: "pointer",
  },
  footer: {
    backgroundColor: "#F5F6FA",
    width: "100%",
    padding: "23px 20px",
    display: "flex",
    justifyContent: "center",
  },
});
class ManagerInformationDialog extends Component  {

  state={
    imageRemoved: true,
    open: false,
    heading: "",
    subHeading: "",
    modalOpen: false,
    modalAlertOpen: false,
    image: null,
    imageLink:null,
    preview: null,
    src: null,
    display: "block",
    gender: "",
    firstName: "",
    errorFirstName: false,
    firstNameHelperText: "",
    secondName: "",
    errorSecondName: false,
    secondNameHelperText: "",
    mobile: "",
    errorMobile: false,
    mobileHelperText: "",
    loading:false
  }

  componentDidMount=()=>{
    this.getProfileDetails()
  }
  
  firstNameChangeHandler = (event) => {
    this.setState({ firstName: event.target.value });
  };

  firstNameErrorHandler = () => {
    if (this.state.firstName !== "") {
      this.setState({ errorFirstName: false, firstNameHelperText: "" });
    } else {
      this.setState({
        errorFirstName: true,
        firstNameHelperText: "First Name cannot be empty.",
      });
    }
  };

  secondNameChangeHandler = (event) => {
    this.setState({ secondName: event.target.value });
  };

  secondNameErrorHandler = () => {
    if (this.state.secondName !== "") {
      this.setState({ errorSecondName: false, secondNameHelperText: "" });
    } else {
      this.setState({
        errorSecondName: true,
        secondNameHelperText: "Last Name cannot be empty.",
      });
    }
  };

  mobileChangeHandler = (event) => {
    let str = event.target.value;
    this.setState({ mobile: str.slice(2) });
  };

  mobileErrorHandler = () => {
    let regexMob = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
    if (this.state.mobile.match(regexMob)) {
      this.setState({ errorMobile: false, mobileHelperText: "" });
    } else {
      this.setState({
        errorMobile: true,
        mobileHelperText: "Please enter a valid phone number",
      });
    }
  };
  genderChangeHandler = (e) => {
    this.setState({ gender: e.target.value });
  };
  
  imageChangeHandler = (e) => {
    
    this.setState({ image: e.target.files[0] });
  };

  removeImageHandler = () => {
    this.setState({loading:true})
    Axios.delete(`facilities/manager/profile`)
      .then((response) => {
    this.setState({loading:false})
        if (response.data.statusCode === 200) {
          
    this.setState({ imageRemoved: true,imageLink:null },()=>{
      this.props.updateProfile(
        {
          profile_photo: null,
        },
        () => {
          
        }
      );
    });
    this.handleClose();
      }
    })
    .catch((error) => {
    this.setState({loading:false})
      
      if ([400,405,422,403].includes(error.response.data.statusCode)) {
        Toast.showErrorToast(error.response.data.error.message[0])
      }
    });
  };

  updateImageHandler = () => {
    this.setState({loading:true})
    var file = new File([this.state.image], "profile_photo", {lastModified: new Date()});
    const packet = new FormData();
    packet.append("profile_photo", file);
    Axios.patch(`facilities/manager/profile`, packet)
      .then((response) => {
    this.setState({loading:false})
        if (response.data.statusCode === 200) {
          
         this.getImage()
         
        }
      })
      .catch((error) => {
    this.setState({loading:false})
        
        if ([400,405,422,403].includes(error.response.data.statusCode)) {
          Toast.showErrorToast(error.response.data.error.message[0])
        }
      });
  };

  getImage=()=>{
    this.setState({loading:true})
    Axios.get("facilities/manager/profile")
      .then((response) => {
    this.setState({loading:false})
        if (response.data.statusCode === 200) {
          
          let profile = response.data.data;
          this.props.updateProfile({
            profile_photo:profile.profile_photo
          })
          this.setState(
            {
              imageLink: profile.profile_photo,
            },
            () => {
              if(this.state.imageLink===null){
                this.setState({imageRemoved:true})
              }
            }
          );
        }
      })
      .catch((error) => {
    this.setState({loading:false})

      });

  }

  getProfileDetails = () => {
    this.setState({loading:true})
    Axios.get("facilities/manager/profile")
      .then((response) => {
    this.setState({loading:false})
        if (response.data.statusCode === 200) {
          
          let profile = response.data.data;
          let g = response.data.data.gender;
          let gender;
          if (g === "M") {
            gender = 3;
          } else if (g === "F") {
            gender = 2;
          } else {
            gender = 1;
          }
          this.setState(
            {
              firstName: profile.first_name,
              secondName: profile.last_name,
              mobile: profile.mobile,
              gender: gender,
              email: profile.email,
              birthDate: new Date(profile.dob),
              imageLink: profile.profile_photo,
            },
            () => {
              if(this.state.imageLink===null){
                this.setState({imageRemoved:true})
              }
            }
          );
        }
      })
      .catch((error) => {
    this.setState({loading:false})

      });
  };

  updateProfileHandler = () => {
    if (
      this.state.firstName === "" ||
      this.state.secondName === "" ||
      this.state.mobile === "" ||
      this.state.errorFirstName === true ||
      this.state.errorSecondName === true ||
      this.state.errorMobile === true
    ) {
      this.mobileErrorHandler();
      this.firstNameErrorHandler();
      this.secondNameErrorHandler();
    } else {
    this.setState({loading:true})
      let gender = this.state.gender;
      if (gender === 1) {
        gender = "0";
      } else if (gender === 2) {
        gender = "F";
      } else if (gender === 3) {
        gender = "M";
      }
      const packet = {
        first_name: this.state.firstName,
        last_name: this.state.secondName,
        gender: gender,
        country_code: "+1",
        mobile: this.state.mobile.replace(/\D/g, ""),
        dob: moment(this.state.birthDate).format("YYYY-MM-DD"),
      };
      Axios.patch(`facilities/manager/profile`, packet)
        .then((response) => {
    this.setState({loading:false})
          if (response.data.statusCode === 200) {
            
            this.props.updateInfo({first_name:packet.first_name,last_name:packet.last_name})
            this.setState(
              {
                heading: "Successfully Updated Profile",
                subHeading: "You have succesfully updated your profile.",
              },
              () => {
                this.handleModalClose();
                this.props.handleClose();
              }
            );
          }
        })
        .catch((error) => {
    this.setState({loading:false})
          
          if ([400,405,422,403].includes(error?.response?.data?.statusCode)) {
            Toast.showErrorToast("Error Updating Profile!")
          }
        });
    }
  };

  onClose = () => {
    this.updateImageHandler();
    this.setState({ display: "none", imageRemoved: false });
  };

  onCrop = (preview) => {
    let file;
    fetch(preview)
      .then((res) => res.blob())
      .then((res) => {
        file = res;
        
        this.setState({ preview: URL.createObjectURL(file),image:file });
      });
  };

  onBeforeFileLoad = (elem) => {
    if (elem.target.files[0].size > 15728640) {
      alert("File is too big!");
      elem.target.value = "";
    }
  };
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  handleModalOpen = () => {
    this.setState({ modalOpen: true });
  };
  handleModalClose = () => {
    this.setState({ modalOpen: false }, () => {});
  };

  handleAlertModalOpen = () => {
    this.setState({ modalAlertOpen: true });
  };
  handleAlertModalClose = () => {
    this.setState({ modalAlertOpen: false });
  };
  render(){
    const { classes } = this.props;
    const { loading } = this.state;
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.handleClose}
        className={classes.root}
        PaperProps={{ style: { borderRadius: 16, padding: 0, margin: 0 } }}
        maxWidth="md"
        fullWidth
      >
        <DialogContent style={{ padding: 0 }}>
        {loading && <Loader />}
          <div className={classes.main}>
            <div style={{ width: "100%" }}>
              <div className={classes.content}>
                <Typography
                  variant="h3"
                  align="center"
                  style={{ marginBottom: 40 }}
                >
                  Admin Information
                </Typography>
               
                <div className="p-img " style={{margin:"auto"}}>
                <DeleteModal
                  open={this.state.open}
                  handleClose={this.handleClose}
                  heading="Remove Image!"
                  subHeading="Are you sure you want to remove this image?"
                  confirm={this.removeImageHandler}
                ></DeleteModal>
               
                {this.state.imageRemoved === false && (
                  <>
                    <img src={this.state.imageLink===null?DefaultImage:this.state.imageLink} alt="profile"  className="photo"/>
                    <CancelButton onClick={this.handleOpen}></CancelButton>
                  </>
                )}
                
                {this.state.imageRemoved === true && (
                  <>
                    <Avatar
                      style={{ display: this.state.null }}
                      width={150}
                      height={150}
                      borderStyle={{
                        borderRadius: "50%",
                        border: "2px dashed rgb(151, 151, 151)",
                      }}
                      onCrop={this.onCrop}
                      onClose={this.onClose}
                      label={<img src={UploadIcon} alt="Upload" />}
                      onBeforeFileLoad={this.onBeforeFileLoad}
                      src={this.state.src}
                    />
                    {/* <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="contained-button-file"
                      type="file"
                      onChange={(e) => this.imageChangeHandler(e)}
                    />
                    <label htmlFor="contained-button-file">
                      <img src={UploadIcon} alt="Upload" />
                    </label> */}
                  </>
                )}
              </div>
              <div className="fc-heading">
              <span>Personal details</span>
            </div>
              <div className="fd-infos">
              <div className="fd-info">
                <InputField
                  style={{ width: 323 }}
                  id="firstName"
                  type="text"
                  error={this.state.errorFirstName}
                  helperText={this.state.firstNameHelperText}
                  label="First Name*"
                  variant="outlined"
                  value={this.state.firstName}
                  onChange={(event) => this.firstNameChangeHandler(event)}
                  onBlur={this.firstNameErrorHandler}
                  fullWidth
                />
              </div>
              <div className="fd-info">
                <InputField
                  style={{ width: 323 }}
                  id="secondName"
                  type="text"
                  error={this.state.errorSecondName}
                  helperText={this.state.secondNameHelperText}
                  label="Last Name*"
                  variant="outlined"
                  value={this.state.secondName}
                  onChange={(event) => this.secondNameChangeHandler(event)}
                  onBlur={this.secondNameErrorHandler}
                  fullWidth
                />
              </div>
              <div className="fd-info">
                <PhoneInputField
                  style={{ width: 323 }}
                  id="phone"
                  type="text"
                  label="Phone Number"
                  variant="outlined"
                  value={this.state.mobile}
                  error={this.state.errorMobile}
                  helperText={this.state.mobileHelperText}
                  onChange={(event) => this.mobileChangeHandler(event)}
                  onBlur={this.mobileErrorHandler}
                  fullWidth
                />
              </div>
              {/* <div className="fd-info">
                <InputField
                  style={{ width: 323 }}
                  id="email"
                  type="text"
                  label="Email Address*"
                  variant="outlined"
                  value={this.state.email}
                  error={this.state.errorEmail}
                  helperText={this.state.emailHelperText}
                  onChange={(event) => this.emailChangeHandler(event)}
                  fullWidth
                />
              </div> */}
              <br />
            
              <div className="fd-info">
                <FormControl variant="outlined">
                  <InputLabel id="dropdown-label" variant="outlined">
                    Gender
                  </InputLabel>
                  <Dropdown
                    style={{ width: 323, height: 56 }}
                    labelId="dropdown-label"
                    id="dropdown"
                    label="Gender"
                    value={this.state.gender}
                    onChange={this.genderChangeHandler}
                  >
                    <MenuItem value={1}>
                      Others
                    </MenuItem>
                    <MenuItem value={2}>Female</MenuItem>
                    <MenuItem value={3}>Male</MenuItem>
                  </Dropdown>
                </FormControl>
              </div>
            </div>
              </div>
              <div className={classes.footer}>
                <PrimaryButton wide onClick={this.updateProfileHandler}>
                  Submit
                </PrimaryButton>
              </div>
            </div>
            <div className={classes.sidebar}>
              <Step
                title="Super Admin Information"
                description="Provide details of the person managing your portal."
                isActive
                step="1"
              />
             
            </div>
          </div>
        </DialogContent>
        <SuccessModal
          open={this.state.modalOpen}
          handleClose={this.handleModalClose}
          heading={this.state.heading}
          subHeading={this.state.subHeading}
          confirm={this.props.handleClose}
          hideCancelBtn={true}
        ></SuccessModal>
        <Modal
          open={this.state.modalAlertOpen}
          handleClose={this.handleAlertModalClose}
          heading={this.state.heading}
          subHeading={this.state.subHeading}
          confirm={this.handleAlertModalClose}
          type="alert"
          hideCancelBtn={true}
        ></Modal>
      </Dialog>
      
    );
  }
  
};

export default withStyles(styles)(ManagerInformationDialog);
