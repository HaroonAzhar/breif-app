import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import RichTextEditor, {EditorValue} from "react-rte";
import {Order, OrderMapper, orderStatusToString} from "../../../types/order";

import Editor from "../../RichTextEditor/TextEditor";
import {
    approveScheduleRelease,
    approveSendRelease,
    getMyOrder,
    returnReleaseForReview,
    updateMyOrder
} from "../../../app/api";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import {toast} from "react-toastify";
import Datetime from 'react-datetime';
import {Moment} from "moment";
import {Journalist} from "../../../types/journalist";
import { FixedSizeList } from "react-window";

interface State {
    release: string,
    order: Order | null,
    approveSendDialogOpen: boolean,
    approveScheduleDialogOpen: boolean,
    returnForReviewDialogOpen: boolean,
    loading: boolean,
    scheduledFor: Date,
    comments: string,
    emailSubject: string
}

export const getUniqueAttributes = (journalists: Journalist[], attribute: string): string[] => {
    // @ts-ignore
    const outlets = journalists.map(j => j[attribute]);
    const merged = outlets.flat(1);
    const set = new Set(merged);
    return Array.from(set);
}

export const ViewReleaseComponent = () => {
    const {orderId} = useParams();
    const [state, setState] = useState<State>({
        release: '',
        order: null,
        approveScheduleDialogOpen: false,
        approveSendDialogOpen: false,
        returnForReviewDialogOpen: false,
        loading: false,
        scheduledFor: new Date(),
        comments: "",
        emailSubject: ""
    });

    const history = useHistory();

    const publications = getUniqueAttributes(state.order?.audience || [], "outlet");
    const sectors = getUniqueAttributes(state.order?.audience || [], "sectors");

    const fetchData = async () => {
        const data = await getMyOrder(orderId);
        const _order = OrderMapper(data);
        const _release = _order.releaseRT || "";

        setState({...state, order: _order, release: _release, emailSubject: _order.emailSubject});
    }

    useEffect(() => {
        fetchData().then(() => console.log("Component loaded"));
    }, []);

    const handleReleaseOnChange = (next: string) => {
        setState({...state, release: next});
    }

    const handleDialogOnClose = () => {
        setState({
            ...state,
            approveSendDialogOpen: false,
            approveScheduleDialogOpen: false,
            returnForReviewDialogOpen: false
        });
    }

    const handleApproveSendOnClick = () => {
        setState({...state, approveSendDialogOpen: true});
    }

    const handleScheduleOnClick = () => {
        setState({...state, approveScheduleDialogOpen: true});
    }

    const handleReturnForReviewOnClick = () => {
        setState({...state, returnForReviewDialogOpen: true});
    }

    const handleApproveSendConfirmOnClick = async () => {
        setState({...state, loading: true});

        const ok = await approveSendRelease(orderId);

        setState({...state, loading: false});

        if (ok) {
            toast("Release has been approved and sent!", {type: "success"});
            handleDialogOnClose();

            history.push(`/dashboard/order/release-success/send`);
        } else {
            toast("Something went wrong.", {type: "error"});
        }
    }

    const handleScheduleConfirmOnClick = async () => {
        setState({...state, loading: true});

        const ok = await approveScheduleRelease(orderId, state.scheduledFor.toISOString());

        setState({...state, loading: false});

        if (ok) {
            toast("Release has been approved and scheduled!", {type: "success"});
            handleDialogOnClose();

            history.push(`/dashboard/order/release-success/scheduled`);
        } else {
            toast("Something went wrong.", {type: "error"});
        }
    }

    const handleScheduledForOnChange = (next: string | Moment) => {
        if (typeof next !== "string") {
            setState({...state, scheduledFor: next.toDate()});
        }
    }

    const handleCommentsOnChange = (next: React.ChangeEvent<HTMLInputElement>) => {
        setState({...state, comments: next.target.value});
    }

    const handleReturnForReviewConfirmOnClick = async () => {
        setState({...state, loading: true});

        const ok = await returnReleaseForReview(orderId, state.comments);

        setState({...state, loading: false});

        if (ok) {
            toast("Release has been returned for review.", {type: "info"});
            handleDialogOnClose();

            history.push(`/dashboard/order/release-success/returned`);
        } else {
            toast("Something went wrong.", {type: "error"});
        }
    }

    const handleSaveOnClick = async () => {
        setState({...state, loading: true});

        const ok = await updateMyOrder(orderId, {releaseRT: state.release.toString()});

        setState({...state, loading: false});

        if (ok) {
            toast("Release has been saved.", {type: "success"});
        } else {
            toast("Something went wrong.", {type: "error"});
        }
    }

    const handleEmailSubjectOnChange = (next: React.ChangeEvent<HTMLInputElement>) => {
        setState({...state, emailSubject: next.target.value});
    }

    if (!state.order) {
        return <span>Loading</span>
    }

    if (state.order.orderStatus !== "waiting_approval") {
        return <span>We are still preparing your release. You'll receive a notification via email when it's ready!</span>
    }

    const Row = ({ index, style }: any) => {
        const journalist = state.order?.audience[index];

        if (!journalist) {
            return <div/>;
        }

        return <div style={style} className={"flex-row margin-h-md"}>
            <span>{journalist.firstName} {journalist.lastName} at {journalist.outlet}</span>
            <div><Button variant={"outlined"} href={`mailto:${journalist.email}`}>Contact</Button></div>
        </div>

    };

    return <div className={"content margin-v-md"}>
        <h3>Your release for order {state.order?.orderNumber}</h3>

        <h4>Order status: {orderStatusToString(state.order.orderStatus)}</h4>

        <h4>Email subject</h4>

        <TextField
            variant={"outlined"}
            placeholder={"Email subject"}
            value={state.emailSubject}
            onChange={handleEmailSubjectOnChange}
            fullWidth
        />

        {/* <RichTextEditor
            value={state.release}
            onChange={handleReleaseOnChange}
        /> */}

<Editor value={state.release}
            onChange={handleReleaseOnChange}  />

        <div className={"flex-row justify-end"}>
            <Button
                variant={"outlined"}
                color={"primary"}
                onClick={handleSaveOnClick}
                disabled={state.loading}
            >
                {state.loading ? "Loading" : "Save"}
            </Button>
        </div>

        <h3>Audience</h3>

        This release is going out to {state.order?.audience.length} journalists
        at {publications.length} publications from the following sectors:

        <ul>
            {sectors.map(sector => <li>{sector}</li>)}
        </ul>

        <h5 style={{color: "black"}}>
            Ensure you have saved any changes you have made to the release before proceeding.
        </h5>

        <div className={"flex-row margin-h-md"}>
            <div>
                <Button
                    variant={"contained"}
                    color={"primary"}
                    disableElevation
                    onClick={handleApproveSendOnClick}
                >
                    Send now
                </Button>
            </div>

            <div>
                <Button
                    variant={"contained"}
                    color={"primary"}
                    disableElevation
                    onClick={handleScheduleOnClick}
                >
                    Schedule for later
                </Button>
            </div>

            <div className={"align-right"}>
                <Button
                    variant={"contained"}
                    color={"primary"}
                    disableElevation
                    onClick={handleReturnForReviewOnClick}
                >
                    Return for review
                </Button>
            </div>
        </div>

        <Dialog open={state.approveSendDialogOpen} onClose={handleDialogOnClose}>
            <DialogTitle title={"Approve and send release"}/>

            <DialogContent>
                This will immediately send your release out. Are you sure?
            </DialogContent>

            <DialogActions>
                <Button
                    variant={"contained"}
                    color={"primary"}
                    disableElevation
                    disabled={state.loading}
                    onClick={handleApproveSendConfirmOnClick}
                >
                    {state.loading ? "Loading" : "Confirm"}
                </Button>
                <Button onClick={handleDialogOnClose}>Cancel</Button>
            </DialogActions>
        </Dialog>

        <Dialog open={state.approveScheduleDialogOpen} onClose={handleDialogOnClose}>
            <DialogTitle title={"Approve and schedule release"}/>

            <DialogContent style={{height: "fit-content"}}>
                <div className={"margin-v-md"}>
                    <span>You can change the date and time of a scheduled release upto 15 minutes before it is sent.</span>

                    <h4>Pick a date and time</h4>

                    <Datetime value={state.scheduledFor} onChange={handleScheduledForOnChange}/>
                </div>

            </DialogContent>

            <DialogActions>
                <Button
                    variant={"contained"}
                    color={"primary"}
                    disableElevation
                    disabled={state.loading}
                    onClick={handleScheduleConfirmOnClick}
                >
                    {state.loading ? "Loading" : "Confirm"}
                </Button>
                <Button onClick={handleDialogOnClose}>Cancel</Button>
            </DialogActions>
        </Dialog>


        <Dialog open={state.returnForReviewDialogOpen} onClose={handleDialogOnClose}>
            <DialogTitle title={"Approve and schedule release"}/>

            <DialogContent>
                <h5>Reasons for review</h5>

                <TextField
                    variant={"outlined"}
                    onChange={handleCommentsOnChange}
                    multiline
                    rows={3}
                    rowsMax={10}
                    placeholder={"Feedback"}
                />
            </DialogContent>

            <DialogActions>
                <Button
                    variant={"contained"}
                    color={"primary"}
                    disableElevation
                    disabled={state.loading}
                    onClick={handleReturnForReviewConfirmOnClick}
                >
                    {state.loading ? "Loading" : "Confirm"}
                </Button>
                <Button onClick={handleDialogOnClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    </div>
}
