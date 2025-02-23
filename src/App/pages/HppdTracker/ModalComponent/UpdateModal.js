import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ClearIcon from '@material-ui/icons/Clear';
import { LinearProgressBar, Loader, TablePagination, Toast } from "App/components";
import { ENDPOINTS } from "api/apiRoutes";
import { API } from "api/apiService";
import queryString from "query-string";
import { NewDialogModal } from "App/components/modal/NewDialogModal";
import HPPDModalTableRow from "./HPPDModalTableRow"

const UpdateModal = ({
    hppdData = [],
    setHppdDataModal = {},
    setisOpenNew,
    JobTitleArray,
    setJobTitleArray,
    hppdDataPaginationModal,
    modalLoading,
    targetvalue,
    targetHppd,
    getJobTitleTrack,
    faciltyID,
    getSelectJobTitileModalData,
    methodUpdate,
    jobKey,
    jobTitleSelectedValues,
    setjobTitleSelectedValues
}) => {
    const classes = useStyles();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    // const [jobTitleSelectedValues, setjobTitleSelectedValues] = useState([]);
    const [JobTitleArrayMapped, setJobTitleArrayMapped] = useState([]);

    useEffect(() => {
        setJobTitleArrayMapped(jobTitleSelectedValues.map(item => item.job_title_id))
    }, [])

    const handleRemoveChips = (id) => {
        setjobTitleSelectedValues((state) => {
            return state.filter(item => item.job_title_id !== id);
        })
    }

    const onCloseEvent = () => {
        setHppdDataModal([]);
        setjobTitleSelectedValues([]);
        // setJobTitleArray([]);
        setisOpenNew(false);
    }

    const HandleConfirm = async () => {
        const payload = {
            target_hppd: targetHppd,
            job_titles: jobTitleSelectedValues.map((job) => job.job_title_id),
            target: 0
        };
        try {
            if (jobTitleSelectedValues?.length > 0) {
                const resp = await API.post(ENDPOINTS.UPDATE_JOBS, payload);
                if (resp?.success) {
                    Toast.showInfoToast(resp?.data?.message);
                    onCloseEvent()
                    getJobTitleTrack(faciltyID)
                }
            }
        } catch (e) {
            console.log(e)
            Toast.showErrorToast(e?.data?.error?.message[0]);
        } finally {
        }
    }

    const onHandleEditJob = async (key) => {
        const payload = {
            job_titles: jobTitleSelectedValues.map((job) => job.job_title_id),
        };
        try {
            const resp = await API.patch(ENDPOINTS.UPDATE_JOBS_TRACK(key), payload);
            if (resp?.success) {
                Toast.showInfoToast(resp?.data?.message);
            }
        } catch (e) {
            console.log(e)
            Toast.showErrorToast(e?.data?.error?.message[0]);
        } finally {
            onCloseEvent()
            getJobTitleTrack(faciltyID)
        }
    }

    const onConfirm = () => {
        if (methodUpdate === "patch") {
            onHandleEditJob(jobKey)
        } else {
            HandleConfirm()
        }
    }

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 700);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    useEffect(() => {
        if (debouncedSearch) {
            getSelectJobTitileModalData(faciltyID, debouncedSearch);
        }
    }, [debouncedSearch]);

    const onHandleSearchChange = (e) => {
        setSearch(e.target.value);
        if (e.target.value === "") {
            getSelectJobTitileModalData(faciltyID, e.target.value)
        }
    }

    return (
        <>
            <NewDialogModal
                // dialogCls={(hppdData.length === 0 && !modalLoading) ? classes.dialogNoFound : classes.dialog}
                dialogCls={classes.dialog}
                heading="Select Job Titles"
                isBackBtnNeeded={true}
                onBack={() => onCloseEvent()}
                closeCrossBtnNeeded={false}
                onClose={() => onCloseEvent()}
                handleConfirm={() => onConfirm()}
                loading={modalLoading}
                isConfirmDisable={modalLoading}
            // needConfirmBtn={!(hppdData.length === 0 && !modalLoading)}
            // needSecBtn={(hppdData.length === 0 && !modalLoading)}
            // secBtnTxt="Close"
            // handleSecBtn={()=>onCloseEvent()}
            >
                {/* {(hppdData.length > 0 || modalLoading) &&  */}
                <div className={classes.mainBlock}>
                    <div className={classes.contentBlock}>
                        <div className={classes.title}>Selected Positions</div>
                        <div className={classes.chipsBlock}>
                            {jobTitleSelectedValues?.map((itm) => {
                                return (<div className={classes.chip}>
                                    <span>{itm.job_title}</span>
                                    <ClearIcon onClick={() => itm.isdisabled ? {} : handleRemoveChips(itm.job_title_id)} className={classes.icon} />
                                </div>)
                            })}
                        </div>
                    </div>

                    <div className={classes.tableBlock}>
                        <div className={classes.searchBlock}>
                            <span>Select From titles below</span>
                            <input
                                placeholder="Search Job Title"
                                type="text"
                                value={search}
                                onChange={(e) => onHandleSearchChange(e)}
                            />
                        </div>
                        <div className={classes.Blocktable}>
                            <TableContainer
                                component={Paper}
                                className={classes.tableContainer}
                            >
                                <Table className={classes.table} aria-label="HPPD Table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.headerCellSelect} rowSpan={2}>
                                                Select
                                            </TableCell>
                                            <TableCell className={classes.headerCellJObTitle} rowSpan={2}>
                                                Job Title
                                            </TableCell>
                                            <TableCell className={classes.headerCellToday} colSpan={2}>
                                                Today
                                            </TableCell>
                                            <TableCell className={classes.headerCell15Days} colSpan={2}>
                                                15 Days - Daily Average
                                            </TableCell>
                                            <TableCell className={classes.headerCell30Days} colSpan={2}>
                                                30 Days - Daily Average
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            {[
                                                "Avg Scheduled HPPD",
                                                "Avg Actual HPPD",
                                            ]
                                                .concat([
                                                    "Avg Scheduled HPPD",
                                                    "Avg Actual HPPD",
                                                ])
                                                .concat([
                                                    "Avg Scheduled HPPD",
                                                    "Avg Actual HPPD",
                                                ])
                                                .map((heading, index) => (
                                                    <TableCell key={index} className={classes.headerCell}>
                                                        {heading}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {hppdData?.length > 0 &&
                                            hppdData?.map((row, index) => {
                                                // if (!row.job_title_data || Object.keys(row.job_title_data).length === 0) return;
                                                return (
                                                    <HPPDModalTableRow
                                                        row={row}
                                                        methodUpdate={methodUpdate}
                                                        setjobTitleSelectedValues={setjobTitleSelectedValues}
                                                        jobTitleSelectedValues={jobTitleSelectedValues}
                                                        JobTitleArrayMapped={JobTitleArrayMapped}
                                                        JobTitleArray={JobTitleArray} />
                                                );
                                            })}
                                        {hppdData?.length === 0 && (
                                            <TableRow>
                                                <TableCell className={classes.cell} colSpan={20}>
                                                    <>
                                                        {
                                                            <div className={classes.noDataFound}>
                                                                No data found.
                                                            </div>
                                                        }{" "}
                                                    </>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {hppdData?.length > 0 && hppdDataPaginationModal.count > 1 && (
                                <TablePagination
                                    count={hppdDataPaginationModal.count}
                                    page={currentPage}
                                    rowsPerPage={pageSize}
                                    setRowsPerPage={(size) => {
                                        setPageSize(size);
                                        setCurrentPage(currentPage);
                                    }}
                                    onChangePage={(e, page) => {
                                        setCurrentPage(page);
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
                {/* } */}
                {/* {(hppdData.length === 0 && !modalLoading) && <div className={classes.NoFoundData}>No Data Found</div>} */}
            </NewDialogModal>
        </>
    );
};

const useStyles = makeStyles((theme) => ({
    dialog: {
        minWidth: "890px"
    },
    dialogNoFound: {
        minWidth: "500px"
    },
    NoFoundData: {
        fontSize: "24px",
        fontWeight: 600,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    mainBlock: {
        display: "flex",
        flexDirection: "column",
        gap: "32px"
    },
    contentBlock: {
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },
    title: {
        fontSize: "12px",
        lineHeight: "15px",
        color: "#82889C",
        fontWeight: 600
    },
    chipsBlock: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "8px",
    },
    chip: {
        display: "flex",
        flexDirection: "row",
        gap: "5px",
        fontSize: "12px",
        lineHeight: "15px",
        fontWeight: 600,
        color: "#020826",
        background: "#F3F4F7",
        padding: "8px",
        borderRadius: "4px"
    },
    icon: {
        color: '#98A2B3',
        width: '16px',
        height: '16px',
        cursor: 'pointer',
    },
    tableBlock: {
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },
    searchBlock: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        "& span": {
            fontSize: "16px",
            lineHeight: "20px",
            fontWeight: 700,
            color: "#000000",
        },
        "& input": {
            padding: "8px 16px",
            background: "#F3F4F7",
            border: "1px solid #DDDFE6",
            borderRadius: "4px",
            color: "#82889C",
            fontSize: "12px",
            lineHeight: "15px",
            fontWeight: 500,
            "& placeholder": {
                color: "#82889C"
            }
        }

    },
    Blocktable: {
    },
    tableContainer: {
        border: `1px solid ${theme.palette.secondary.gray300}`,
        borderBottom: "none",
        borderRadius: 4,
    },
    table: {
        minWidth: "650px",
        borderCollapse: "collapse",
        overflowY: "auto",
    },
    headerCellSelect: {
        fontWeight: 500,
        lineHeight: "15px",
        fontSize: "12px !important",
        textAlign: "center",
        borderRight: `1px solid ${theme.palette.secondary.gray300}`,
        borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
        backgroundColor: theme.palette.background.lightBlue,
        color: `${theme.palette.secondary.darkGray} !important`,
        minWidth: "57px",
    },
    headerCellJObTitle: {
        minWidth: "113px",
        fontWeight: 500,
        lineHeight: "15px",
        fontSize: "12px !important",
        textAlign: "left",
        borderRight: `1px solid ${theme.palette.secondary.gray300}`,
        borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
        backgroundColor: theme.palette.background.lightBlue,
        color: `${theme.palette.secondary.darkGray} !important`,
    },
    headerCellToday: {
        fontWeight: 600,
        lineHeight: "15px",
        fontSize: "12px !important",
        textAlign: "center",
        borderRight: `1px solid ${theme.palette.secondary.gray300}`,
        borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
        backgroundColor: theme.palette.secondary.ltPurple,
        color: `${theme.palette.secondary.darkGray} !important`,
    },
    headerCell15Days: {
        fontWeight: 600,
        lineHeight: "15px",
        fontSize: "12px !important",
        textAlign: "center",
        borderRight: `1px solid ${theme.palette.secondary.gray300}`,
        borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
        backgroundColor: theme.palette.background.extraLtPink,
        color: `${theme.palette.secondary.darkGray} !important`,
    },
    headerCell30Days: {
        fontWeight: 600,
        lineHeight: "15px",
        fontSize: "12px !important",
        textAlign: "center",
        borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
        backgroundColor: theme.palette.background.ltGreen,
        color: `${theme.palette.secondary.darkGray} !important`,
    },
    headerCell: {
        width: "200px",
        lineHeight: "15px",
        fontWeight: "bold",
        borderRight: `1px solid ${theme.palette.secondary.gray300}`,
        borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
        backgroundColor: theme.palette.background.lightBlue,
        color: `${theme.palette.secondary.darkGray} !important`,
        fontWeight: 500,
        fontSize: "12px !important",
    },
}));


export default UpdateModal;
