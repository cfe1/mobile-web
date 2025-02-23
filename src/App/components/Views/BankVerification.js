import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import {
    PrimaryButton,
    SecondaryButton,
    Toast,
    InputField,
} from "../../components";


import {Axios} from "../../../api/apiConsts";
const useStyles = makeStyles({
    root: {
        padding: "35px 40px 20px 20px",
    },
    content: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",

    },
    paper: {
        padding: 30,
        marginBottom: 30,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"column",
        textAlign:"center"

    },
    subtitle: {
        marginBottom: 24,
    },
    subtitleSetting: {
        marginBottom: 8,
    },
    note:{
        marginBottom: 16,
        marginTop:8,
        color:"#888fa0"
    },
    description: {
        width: 364,
        textAlign: "center",
        marginBottom: 64,
    },
    image: {
        marginTop: 15,
        marginBottom: 20,
    },
    footer: {
        backgroundColor: "#F5F6FA",
        width: "100%",
        padding: "23px 0px",
        display: "flex",
        justifyContent: "center",
    },
});

const BankVerification = (props) => {
    const classes = useStyles();
    const [amount1 ,setAmount1] = useState()
    const [amount2 ,setAmount2] = useState()
    const [errorAmount1 ,setErrorAmount1] = useState(false)
    const [errorAmount2 ,setErrorAmount2] = useState(false)
    const [htAmount1 ,setHtAmount1] = useState()
    const [htAmount2 ,setHtAmount2] = useState()

    useEffect(() => {

    }, []);


    const handleUpdation = () => {
        handleBankVerification()
        props.handleClose();
    };

    const handleCancel = () => {
        props.handleClose();
    };
    const amount1Handler = (e) => {
        setAmount1(e.target.value)
      };

     const  amount1ErrorHandler = () => {
        if (amount1 === "") {
          setErrorAmount1(true)
          setHtAmount1("Amount 1 is required")
        }
        else if(amount1>0.1){
            setErrorAmount1(true)
            setHtAmount1("Amount should be less than and equal to 0.1")
        }
        else {
          setErrorAmount1(false)
          setHtAmount1("")
        }
      };
      const amount2Handler = (e) => {
        setAmount2(e.target.value)
      };

     const  amount2ErrorHandler = () => {
        if (amount2 === "") {
          setErrorAmount2(true)
          setHtAmount2("Amount 1 is required")
        } 
        else if(amount2>0.1){
            setErrorAmount2(true)
            setHtAmount2("Amount should be less than and equal to 0.1")
        }else {
          setErrorAmount2(false)
          setHtAmount2("")
        }
      };


    // const updateBankVerification = async (newFrequency) => {
    //     //this.setState({ loading: true });
    //     props.handleLoader(true)

    //     const payload = {
    //         "amount1": {
    //             "value": amount1,
    //             "currency": "USD"
    //         },
    //         "amount2": {
    //             "value": amount2,
    //             "currency": "USD"
    //         }
    //     }

    //     try {
    //         const resp = await API.post(props.isAdmin?ENDPOINTS.UPDATE_FACILITY_BANKVERIFICATION:ENDPOINTS.UPDATE_BANKVERIFICATION, payload);
    //         if (resp.success) {
    //             // this.setState({ loading: false });
    //             props.handleLoader(false)
    //             
    //             props.fetchFacilityBankDetails()
               
    //         }
    //     } catch (e) {
    //         
    //         Toast.showErrorToast(e.data.error.message[0]);
    //     } finally {
    //         //this.setState({ loading: false });
    //         props.handleLoader(false)
    //     }
    // };

    const handleBankVerification =()=>{
        props.handleLoader(true)
              const packet = {
                amount1: {
                    value: amount1,
                    currency: "USD"
                },
                amount2: {
                    value: amount2,
                    currency: "USD"
                }
              };
              Axios.post(`/verify-tax-bank`, packet)
                .then((response) => {
                    props.handleLoader(false)
                  
                  if (response.data.statusCode === 200) {
                props.getTaxBankData()
                  }
                })
                .catch((error) => {
                    props.handleLoader(false)
                  
                  if (error.response.status !== 500) {
                    if ([400,405,422,403].includes(error.response.data.statusCode) ) {
                      Toast.showErrorToast(error.response.data.error.message[0]);
                    }
                  }
                });
            
          }
    


    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            className={classes.root}
            PaperProps={{ style: { borderRadius: 16 } }}
            maxWidth="sm"
            fullWidth
        >
            <DialogContent style={{ padding: 0 }}>
                <div className={classes.content}>
                    <Paper className={classes.paper}>
                        <Typography variant="h6" className={classes.subtitleSetting}>
                            Bank Details Verification
                        </Typography>
                        <Typography className={classes.note}>
                            We have credited some amounts  to your given account.
                            Please verify and enter those amounts to the below fields.
                            If you didn't receive any amount please wait. It will process
                            in your account in 1-2  business days.
                        </Typography>
                        <Typography className={classes.note}>
                            NOTE: You only have 3 attempts to get your Bank Account verified.
                        </Typography>
                       
                            <Grid item xl={6}>
                                <InputField
                                    style={{ width: 323 }}
                                    id="amount1"
                                    type="text"
                                    error={errorAmount1}
                                    helperText={htAmount1}
                                    label="Amount 1 ($)"
                                    variant="outlined"
                                    value={amount1}
                                    onChange={(event) => amount1Handler(event)}
                                    onBlur={()=> amount1ErrorHandler()}
                                    fullWidth
                                />
                            </Grid>
                        
                       
                            <Grid item xl={6}>
                                <InputField
                                    style={{ width: 323 }}
                                    id="amount1"
                                    type="text"
                                    error={errorAmount2}
                                    helperText={htAmount2}
                                    label="Amount 1 ($)"
                                    variant="outlined"
                                    value={amount2}
                                    onChange={(event) => amount2Handler(event)}
                                    onBlur={()=> amount2ErrorHandler()}
                                    fullWidth
                                />
                            </Grid>
                        
                    </Paper>

                            <div className={classes.footer}>
                                <SecondaryButton
                                    wide
                                    onClick={handleCancel}
                                    style={{ marginRight: 20 }}
                                >
                                    Cancel
                        </SecondaryButton>
                                <PrimaryButton wide onClick={handleUpdation}>
                                    Submit
                        </PrimaryButton>
                            </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};


export default BankVerification;
