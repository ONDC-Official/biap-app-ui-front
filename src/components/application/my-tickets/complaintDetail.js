import React, { useContext, useEffect, useRef, useState } from "react";
import useStyles from "../../../components/orders/orderDetails/style";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import moment from "moment";
import Box from "@mui/material/Box";
import { Link, useLocation } from "react-router-dom";
import { ToastContext } from "../../../context/toastContext";
import Loading from "../../shared/loading/loading";
import { ISSUE_TYPES } from "../../../constants/issue-types";
import useCancellablePromise from "../../../api/cancelRequest";
import { toast_actions, toast_types } from "../../shared/toast/utils/toast";
import { getCall, postCall } from "../../../api/axios";
import { getValueFromCookie } from "../../../utils/cookies";
import { SSE_TIMEOUT } from "../../../constants/sse-waiting-time";
import CustomerActionCard from "./action-card/actionCard";
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { ReactComponent as TimelineIcon } from '../../../assets/images/timeline.svg';

const ComplaintDetail = () => {
    const classes = useStyles();
    const location = useLocation();
    const { data } = location.state || {};
    const { order_details, description, category, sub_category, issueId, issue_status, created_at, issue_actions, transaction_id, bppId, resolution, message_id, resolution_provider } = data;

    // STATES
    const [statusLoading, setStatusLoading] = useState(false);
    const [toggleActionModal, setToggleActionModal] = useState(false);
    const [issueActions, setIssueActions] = useState([]);
    const [issueStatus, setIssueStatus] = useState(issue_status)
    // HELPERS

    // REFS
    const cancelPartialEventSourceResponseRef = useRef(null);
    const onIssueEventSourceResponseRef = useRef(null);
    const eventTimeOutRef = useRef([]);

    // CONTEXT
    const dispatch = useContext(ToastContext);

    // HOOKS
    const { cancellablePromise } = useCancellablePromise();

    const allCategory = ISSUE_TYPES.map((item) => {
        return item.subCategory.map((subcategoryItem) => {
            return {
                ...subcategoryItem,
                category: item.value,
            };
        });
    }).flat();


    // use this function to dispatch error
    function dispatchToast(message, type) {
        dispatch({
            type: toast_actions.ADD_TOAST,
            payload: {
                id: Math.floor(Math.random() * 100),
                type,
                message,
            },
        });
    }

    useEffect(() => {
        mergeRespondantArrays(issue_actions)
        fetchOnIssueDataThroughEvents()
    }, [])


    // use this function to fetch on_issue through events
    function fetchOnIssueDataThroughEvents(issue) {
        onIssueEventSourceResponseRef.current = [];

        const token = getValueFromCookie("token");
        let header = {
            headers: {
                ...(token && {
                    Authorization: `Bearer ${token}`,
                }),
            },
        };
        let es = new window.EventSourcePolyfill(
            `${process.env.REACT_APP_BASE_URL}issueApis/events?messageId=${message_id}`,
            header
        );

        es.addEventListener("on_issue", (e) => {
            if (e?.data) {
                const { messageId } = JSON.parse(e.data);
                getPartialCancelOrderDetails(messageId, created_at);
            }
        });


        const timer = setTimeout(() => {
            es.close();
        }, SSE_TIMEOUT);

        eventTimeOutRef.current = [
            ...eventTimeOutRef.current,
            {
                eventSource: es,
                timer,
            },
        ];
    }

    // on Issue api
    async function getPartialCancelOrderDetails(message_id, createdDateTime) {
        try {
            const data = await cancellablePromise(
                getCall(`/issueApis/v1/on_issue?messageId=${message_id}&createdDateTime=${createdDateTime}`)
            );
            onIssueEventSourceResponseRef.current = [
                ...onIssueEventSourceResponseRef.current,
                data,
            ];
        } catch (err) {
            console.log(err?.message);
            eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
                eventSource.close();
                clearTimeout(timer);
            });
        }
    }

    const mergeRespondantArrays = (actions) => {
        let resActions = actions.respondent_actions,
            comActions = actions.complainant_actions.map(item => { return ({ ...item, respondent_action: item.complainant_action }) }),
            mergedarray = [...comActions, ...resActions]

        mergedarray.sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at));
        setIssueActions(mergedarray)
    }


    const checkIssueStatus = async () => {
        cancelPartialEventSourceResponseRef.current = [];
        setStatusLoading(true);
        try {
            const data = await cancellablePromise(
                postCall("/issueApis/v1/issue_status", {
                    context: {
                        transaction_id,
                        bpp_id: bppId
                    },
                    message: {
                        issue_id: issueId,
                    },
                })
            );
            //Error handling workflow eg, NACK
            if (data.message && data.message.ack.status === "NACK") {
                setStatusLoading(false);
                dispatchToast("Something went wrong", toast_types.error);
            } else {
                fetchIssueStatusThroughEvents(data.context?.message_id);
            }
        } catch (err) {
            setStatusLoading(false);
            dispatchToast(err?.message, toast_types.error);
        }
    };

    function fetchIssueStatusThroughEvents(message_id) {
        const token = getValueFromCookie("token");
        let header = {
            headers: {
                ...(token && {
                    Authorization: `Bearer ${token}`,
                }),
            },
        };
        let es = new window.EventSourcePolyfill(
            `${process.env.REACT_APP_BASE_URL}issueApis/events?messageId=${message_id}`,
            header
        );
        es.addEventListener("on_issue_status", (e) => {
            const { messageId } = JSON.parse(e?.data);
            getIssueStatusDetails(messageId);
        });

        const timer = setTimeout(() => {
            es.close();
            if (cancelPartialEventSourceResponseRef.current.length <= 0) {
                dispatchToast(
                    "Cannot proceed with you request now! Please try again",
                    toast_types.error
                );
                setStatusLoading(false);
            }
        }, SSE_TIMEOUT);

        eventTimeOutRef.current = [
            ...eventTimeOutRef.current,
            {
                eventSource: es,
                timer,
            },
        ];
    }

    async function getIssueStatusDetails(message_id) {
        try {
            const data = await cancellablePromise(
                getCall(`/issueApis/v1/on_issue_status?messageId=${message_id}`)
            );
            cancelPartialEventSourceResponseRef.current = [
                ...cancelPartialEventSourceResponseRef.current,
                data,
            ];
            setStatusLoading(false);
            if (data?.message) {
                mergeRespondantArrays({ respondent_actions: data.message.issue?.issue_actions.respondent_actions, complainant_actions: issue_actions.complainant_actions })
                dispatch({
                    type: toast_actions.ADD_TOAST,
                    payload: {
                        id: Math.floor(Math.random() * 100),
                        type: toast_types.success,
                        message: "Complaint status updated successfully!",
                    },
                });
            } else {
                dispatchToast(
                    "Something went wrong!, issue status cannot be fetched",
                    toast_types.error
                );
            }
        } catch (err) {
            setStatusLoading(false);
            dispatchToast(err?.message, toast_types.error);
            eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
                eventSource.close();
                clearTimeout(timer);
            });
        }
    }

    return (
        <Grid container spacing={5} className={classes.orderDetailsContainer}>
            {toggleActionModal && (
                <CustomerActionCard
                    supportActionDetails={data}
                    onClose={() => setToggleActionModal(false)}
                    onSuccess={(actionData) => {
                        dispatchToast(actionData[0].respondent_action === "ESCALATE" ? "GRO would be reaching out to you soon" : "Action successfully taken", toast_types.success);
                        setToggleActionModal(false);
                        setIssueActions([...issueActions, ...actionData])
                        actionData[0].respondent_action === "CLOSE" && setIssueStatus('Close')
                    }}
                />
            )}
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div role="presentation">
                    <Breadcrumbs aria-label="breadcrumb">
                        <MuiLink
                            component={Link}
                            underline="hover"
                            color="inherit"
                            to="/application/complaints"
                        >
                            Complaint
                        </MuiLink>
                        {issueId && (
                            <Typography color="text.primary">Complaint Details</Typography>
                        )}
                    </Breadcrumbs>
                </div>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="h4">
                    Complaint Details
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={7} lg={7} xl={7}>

                {/* RESPONDENT ACTIONS  */}
                {issueActions?.length > 0 && (
                    <div>
                        <Timeline
                            sx={{
                                [`& .${timelineItemClasses.root}:before`]: {
                                    flex: 0,
                                    padding: 0,
                                },
                            }}
                        >
                            {issueActions?.map(
                                (
                                    { respondent_action, short_desc, updated_at, updated_by },
                                    itemIndex
                                ) => {
                                    return (
                                        <TimelineItem key={`timeline-index-${itemIndex}`}>
                                            <TimelineSeparator>
                                                <TimelineDot className={classes.timelineDot}>
                                                    <TimelineIcon className={classes.timelineIcon} />
                                                </TimelineDot>
                                                {
                                                    issueActions.length - 1 > itemIndex && (
                                                        <TimelineConnector className={classes.dottedConnector} />
                                                    )
                                                }
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Typography component="div" variant="body" className={classes.timelineContentHeaderTypo}>
                                                    {respondent_action}
                                                    <Typography component="span" variant="body1" className={classes.timelineContentHeaderTimeTypo}>
                                                        {moment(updated_at).format(
                                                            "DD/MM/yy"
                                                        )} at {moment(updated_at).format("hh:mma")}
                                                    </Typography>
                                                </Typography>

                                                <Typography component="div" variant="body" className={classes.timelineContentHeaderTypo}>
                                                    {short_desc}
                                                </Typography>
                                                <Typography component="span" variant="body1" >
                                                    {`Updated by: ${updated_by?.person?.name}, ${updated_by?.org.name.split('::')[0]}`}
                                                </Typography>

                                            </TimelineContent>
                                        </TimelineItem>
                                    );
                                }
                            )}
                        </Timeline>
                    </div>
                )}


                <Box component={"div"} className={classes.divider} />

                <Grid container spacing={3} columns={10}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography variant="h4" className={classes.customerDetailsTypo}>
                            Respondent Details
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                        <Typography component="div" variant="body" className={classes.customerDetailsLabel}>
                            Phone
                        </Typography>
                        <Typography component="div" variant="body" className={classes.customerDetailsValue}>
                            {issue_actions?.respondent_actions[issue_actions.respondent_actions.length - 1]?.updated_by
                                ?.contact?.phone ?? "N/A"}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                        <Typography component="div" variant="body" className={classes.customerDetailsLabel}>
                            Email
                        </Typography>
                        <Typography component="div" variant="body" className={classes.customerDetailsValue}>
                            {issue_actions?.respondent_actions[issue_actions.respondent_actions.length - 1]?.updated_by
                                ?.contact?.email ?? "N/A"}
                        </Typography>


                    </Grid>
                    {issueActions.some(x => x.respondent_action === "ESCALATE") &&
                        <>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Typography component="div" variant="body" className={classes.customerDetailsLabel}>
                                    Contact info of GRO
                                </Typography>
                                <Typography component="div" variant="body" className={classes.customerDetailsValue}>
                                    A Grievance has been raised. The GRO will be reaching out to you in 24 hours.
                                </Typography>

                            </Grid>

                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                <Typography component="div" variant="body" className={classes.customerDetailsLabel}>
                                    Name
                                </Typography>
                                <Typography component="div" variant="body" className={classes.customerDetailsValue}>
                                    {process.env.BUYER_APP_GRO_NAME}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                <Typography component="div" variant="body" className={classes.customerDetailsLabel}>
                                    Phone
                                </Typography>
                                <Typography component="div" variant="body" className={classes.customerDetailsValue}>
                                    {process.env.BUYER_APP_GRO_EMAIL}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Typography component="div" variant="body" className={classes.customerDetailsLabel}>
                                    Email
                                </Typography>
                                <Typography component="div" variant="body" className={classes.customerDetailsValue}>
                                    {process.env.BUYER_APP_GRO_EMAIL}
                                </Typography>
                            </Grid>
                        </>
                    }
                </Grid>


            </Grid>

            <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>

                {/* Complaint Summary */}
                <div>
                    <Card className={classes.orderSummaryCard}>
                        <Typography variant="h5" className={classes.orderNumberTypo}>
                            {`Issue Id: `}
                            <span className={classes.orderNumberTypoBold}>
                                {issueId}
                            </span>

                            <Chip
                                className={classes.statusChip}
                                color={issueStatus === "Close" ? "error" : "success"}
                                label={issueStatus}
                            />
                        </Typography>
                        <Typography variant="body" className={classes.orderNumberTypo}>
                            {`Order Id: `}
                            <MuiLink
                                component={Link}
                                underline="hover"
                                color="inherit"
                                to={`/application/order/${order_details.id}`}
                            >
                                {order_details.id}
                            </MuiLink>
                        </Typography>
                        <Typography variant="body1" className={classes.orderOnTypo}>
                            {`Issue Raised On: ${moment(created_at).format(
                                "DD/MM/yy"
                            )} at ${moment(created_at).format("hh:mma")}`}{" "}
                            | {category}:{" "}
                            {allCategory.find(x => x.enums === sub_category)?.value ?? "NA"}
                        </Typography>
                        <Box
                            component={"div"}
                            className={`${classes.orderSummaryDivider} ${classes.marginBottom0}`}
                        />
                        {/*<OrderTimeline />*/}
                        {order_details?.items?.map(({ id, product, quantity }, index) => {
                            const totalPriceOfProduct =
                                Number(product?.price?.value) * Number(quantity?.count);
                            return (
                                <>
                                    <div key={id} className="d-flex align-items-center pt-3">
                                        <div>
                                            <Typography variant="h5" className={classes.orderNumberTypoBold}>
                                                {product.descriptor.name}
                                            </Typography>
                                            <div className="pt-2 py-2">
                                                <Typography
                                                    variant="body1"
                                                    className={classes.summaryItemPriceLabel}
                                                >
                                                    {`QTY: ${quantity?.count ?? "0"}  X  ₹ ${Number(
                                                        product?.price?.value
                                                    )?.toFixed(2)}`}
                                                </Typography>
                                            </div>
                                        </div>
                                        <div className="ms-auto">
                                            <Typography variant="h5" className={classes.totalValue}>
                                                ₹ {Number(totalPriceOfProduct)?.toFixed(2)}
                                            </Typography>
                                        </div>
                                    </div>
                                    {index < order_details?.items?.length - 1 && (
                                        <Box
                                            component={"div"}
                                            className={`${classes.orderSummaryDivider}`}
                                        />
                                    )}
                                </>
                            );
                        })}
                        <Box component={"div"} className={classes.divider} />
                        {/* ISSUE DESCRIPTION */}
                        <div>
                            <Typography component="div" variant="body" className={classes.customerDetailsLabel}>
                                {description?.short_desc ?? "NA"}
                            </Typography>
                            <Typography component="div" variant="body" className={classes.customerDetailsValue}>
                                {description?.long_desc ?? "NA"}
                            </Typography>
                            {description?.images &&
                                description?.images?.map((image) => {
                                    return (
                                        <div className="container py-2 px-0">
                                            <a href={image} rel="noreferrer" target="_blank">
                                                <img style={{ height: "25%", width: "25%" }} src={image} />
                                            </a>
                                        </div>
                                    );
                                })}
                        </div>

                        <Box component={"div"} className={classes.divider} />

                        {/* ITEM RESOLUTION TIME  */}

                        <div className="row">
                            <div className="col-md-6 py-2">
                                <Typography component="div" variant="body" className={classes.customerDetailsLabel}>
                                    Expected response time:
                                </Typography>
                                <Typography component="div" variant="body" className={classes.customerDetailsValue}>
                                    {moment(created_at)
                                        .add(2, "hours")
                                        .format("hh:mm a, MMMM Do, YYYY")}
                                </Typography>
                            </div>
                            <div className="col-md-6 py-2">
                                <Typography component="div" variant="body" className={classes.customerDetailsLabel}>
                                    Expected resolution time:
                                </Typography>
                                <Typography component="div" variant="body" className={classes.customerDetailsValue}>
                                    {moment(created_at)
                                        .add(1, "days")
                                        .format("hh:mm a, MMMM Do, YYYY")}
                                </Typography>
                            </div>
                        </div>


                        <Box component={"div"} className={classes.divider} />
                        <div className={classes.summaryItemActionContainer}>
                            {(!issueActions?.some(x => x.respondent_action === "CLOSE")) &&
                                <div className="ms-auto">
                                    <div className="d-flex align-items-center justify-content-center flex-wrap">
                                        {
                                            (issueActions[issueActions.length - 1]?.respondent_action !== "PROCESSING") && (issueActions[issueActions.length - 1]?.respondent_action !== "ESCALATE") && issueActions.some(x => x.respondent_action === "RESOLVED") ?

                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    className={classes.helpButton}
                                                    disabled={statusLoading}
                                                    onClick={() => {
                                                        setToggleActionModal(true)
                                                    }}
                                                >
                                                    {statusLoading ? (
                                                        <Loading />
                                                    ) : (
                                                        "Take Action"
                                                    )}
                                                </Button>
                                                :
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    className={classes.helpButton}
                                                    disabled={statusLoading}
                                                    onClick={() => checkIssueStatus()}
                                                >
                                                    {statusLoading ? (
                                                        <Loading />
                                                    ) : (
                                                        "Get Status"
                                                    )}
                                                </Button>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </Card>
                    <br />

                </div>

                {/* RESOLUTION  */}
                {resolution && (
                    <>
                        <Box component={"div"} className={classes.divider} />

                        <Grid container spacing={3} columns={10}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Typography variant="h4" className={classes.customerDetailsTypo}>
                                    Resolution
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Typography component="span" variant="body1" >
                                    {`Updated on: ${moment((issueActions.reverse().find(obj => obj.respondent_action === "RESOLVED") || {}).updated_at).format(
                                        "DD/MM/yy"
                                    )} at ${moment((issueActions.reverse().find(obj => obj.respondent_action === "RESOLVED") || {}).updated_at).format("hh:mma")}`}
                                </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Typography component="span" variant="body1" >
                                    {`Updated by: ${resolution_provider?.respondent_info?.organization?.person?.name}, ${resolution_provider?.respondent_info?.organization?.org?.name.split('::')[0]}`}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Typography component="div" variant="body" className={classes.customerDetailsLabel}>
                                    {resolution?.short_desc}
                                </Typography>
                                {resolution?.long_desc &&
                                    <Typography component="div" variant="body" className={classes.customerDetailsValue}>
                                        {resolution?.long_desc}
                                    </Typography>
                                }

                            </Grid>

                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                <Typography component="div" variant="body" className={classes.customerDetailsLabel}>
                                    Action
                                </Typography>
                                <Typography component="div" variant="body" className={classes.customerDetailsValue}>
                                    {resolution?.action_triggered}
                                </Typography>
                            </Grid>

                            {resolution?.refund_amount &&
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Typography component="div" variant="body" className={classes.customerDetailsLabel}>
                                        Refund Amount
                                    </Typography>
                                    <Typography component="div" variant="body" className={classes.customerDetailsValue}>
                                        {resolution?.refund_amount}
                                    </Typography>
                                </Grid>
                            }
                        </Grid>
                    </>
                )}

            </Grid>

        </Grid>
    );
}

export default ComplaintDetail