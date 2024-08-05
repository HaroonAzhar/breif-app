import React, {useEffect, useState} from "react";
import {Journalist, JournalistMapper} from "../../../../types/journalist";
import Editor from "../../../RichTextEditor/TextEditor";
import {
    getAllJournalists,
    getUsers,
    getUsersOrders,
    postNotifyUser,
    postSaveAudience,
    sendRelease,
    sendTestRelease,
    updateOrder
} from "../../../../app/api";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import '@inovua/reactdatagrid-community/index.css'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    LinearProgress, Table, TableBody, TableCell, TableRow,
    TextField
} from "@material-ui/core";
import {TypeOnSelectionChangeArg} from "@inovua/reactdatagrid-community/types/TypeDataGridProps";
import RichTextEditor, {EditorValue} from 'react-rte';
import {toast} from "react-toastify";
import Select from 'react-select'
import {filterTypes, filterValue, getColumns} from "./datagrid-config";
import {Order, OrderMapper} from "../../../../types/order";
import Checkbox from '@material-ui/core/Checkbox';
import Datetime from "react-datetime";
import {Moment} from "moment";
import { release } from "os";

interface State {
    user: number | null,
    usersOrders: Order[],
    order: Order | null,
    subject: string,
    replyTo: string,
    release: string,
    allJournalists: Journalist[],
    selectedJournalists: Journalist[],
    selectedRows: any,
    users: { value: number, label: string }[],
    testReleaseLoading: boolean,
    releaseLoading: boolean,
    uploadLoading: boolean,
    sendForApprovalLoading: boolean,
    mailingListStatus: string,
    saveAudienceLoading: boolean,
    columns: any[],
    audienceApproved: boolean,
    scheduledFor: Date,
    approveScheduleDialogOpen: boolean,
    loading: boolean
}

const SendPressReleaseComponent = () => {
    const [state, setState] = useState<State>({
        user: null,
        usersOrders: [],
        order: null,
        subject: "",
        replyTo: "",
        release: '',
        allJournalists: [],
        selectedJournalists: [],
        selectedRows: [],
        users: [],
        testReleaseLoading: false,
        releaseLoading: false,
        uploadLoading: false,
        sendForApprovalLoading: false,
        mailingListStatus: "",
        saveAudienceLoading: false,
        columns: [],
        audienceApproved: false,
        loading: false,
        scheduledFor: (new Date()),
        approveScheduleDialogOpen: false
    });

    const usersOrdersOptions = state.usersOrders.map(order => {
        return {
            value: order,
            label: order.orderNumber
        }
    });


    const saveAudience = async () => {
        console.log("journaliist selected", state.selectedJournalists )
        if (!state.order) {
            return;
        }

        setState({...state, saveAudienceLoading: true});

        const audience = state.selectedJournalists.map(j => j.id);

        // const ok = await updateOrder(state.order.id, {audience});

        const ok = await postSaveAudience({audience, orderId: state.order.id});

        setState({...state, saveAudienceLoading: false});

        if (ok) {
            toast("Audience updated", {type: "success"});
        } else {
            toast("Something went wrong", {type: "error"});
        }
    }

    const uploadRelease = async () => {
        if (!state.order) {
            return;
        }

        setState({...state, uploadLoading: true});
        console.log("save realeese", state.release)

        const ok = await updateOrder(state.order.id, {
            "releaseRT": JSON.stringify(state.release),
            emailSubject: state.subject,
            replyTo: state.replyTo,
            audienceApproved: state.audienceApproved
        });

        if (ok) {
            toast("Release saved", {type: "success"});
        } else {
            toast("Something went wrong", {type: "error"})
        }

        setState({...state, uploadLoading: false});
    }

    const handleOrderNumberOnChange = (next: { value: Order, label: string } | null) => {
        if (next) {
            setState({...state, order: next.value, audienceApproved: next.value.audienceApproved});
        }
    }

    useEffect(() => {
        let mounted = true;

        // Get that users orders
        if (state.user) {
            getUsersOrders(state.user).then(response => {
                const _orders = response.map((r: any) => OrderMapper(r));

                if (mounted) {
                    setState({...state, usersOrders: _orders});
                }

            }).catch(error => {
                console.log(error);
            });
        }

        return () => {
            mounted = false;
        }
    }, [state.user]);

    useEffect(() => {
        let mounted = true;

        if (state.order) {
            // getMailingListStatus({orderId: state.order.id}).then(data => {
            //     console.log(data);
            // });

            const rows = convertJournalistsToRows(state.order.audience);

            const importedRelease =state.order.releaseRT || "markdown";

            const nextState = {
                release: importedRelease,
                selectedRows: rows,
                selectedJournalists: state.order.audience,
                subject: state.order.emailSubject || "",
                replyTo: state.order.replyTo || "",
                mailingListStatus: ""
            }

            if (mounted) {
                setState({...state, ...nextState});
            }
        }
        console.log("aa o", state.order)
        console.log("aa r", state.release)
        console.log("aa j", state.allJournalists)
        return () => {
            mounted = false
        };
        

    }, [state.order]);

    const fetchData = async (mounted: boolean) => {
        const data = await getAllJournalists();
        const _journalists = data.map((d: any) => JournalistMapper(d));
        const columns = await getColumns();

        console.log("COLUMNS: ", columns);

        let _users = await getUsers();
        _users = _users.map((u: any) => {
            return {
                value: u.id,
                label: u.email
            }
        });
         console.log("is it really  moounted", mounted)
        if (mounted) {
            setState({...state, allJournalists: _journalists, users: _users, columns});
        }
    }

    useEffect(() => {
        let mounted = true;

        fetchData(mounted).then(() => console.log("Component loaded"));

        return () => {
            mounted = false
        };
    }, []);

    // Converts an array of Journalists into an object
    const convertJournalistsToRows = (journalists: Journalist[]): any => {
        const rows = {};
        // @ts-ignore
        journalists.forEach(j => {
            // @ts-ignore
            rows[j.id] = j;
        });

        return rows;
    }

    // Handles both updating the DataGrid rows and the state variable for selected Journalists
    const updateSelectedJournalists = (rows: any, data: Journalist[]): void => {
        setState({...state, selectedRows: rows, selectedJournalists: data});
    }
    const setRelease = (release:string , currentState: State):void=>{
        console.log("state when setting release", currentState)
        setState({...state, release: release})

    }

    const attemptScheduleRelease = async () => {
        if (!state.order) {
            return;
        }

        setState({...state, loading: true});
        const ok = await updateOrder(state.order.id, {
            orderStatus: "approved_release_scheduled",
            scheduledFor: state.scheduledFor,
            scheduledReleaseSent: false
        });
        setState({...state, loading: false});

        if (ok) {
            toast("Test release scheduled", {type: "success"});
        } else {
            toast("Something went wrong", {type: "error"})
        }
    }

    const attemptSendTestRelease = async () => {
        if (!state.order) {
            return;
        }

        setState({...state, testReleaseLoading: true});
        const ok = await sendTestRelease({orderId: state.order.id});
        setState({...state, testReleaseLoading: false});

        if (ok) {
            toast("Test release sent", {type: "success"});
        } else {
            toast("Something went wrong", {type: "error"})
        }
    }

    const attemptSendRelease = async () => {
        if (!state.order) {
            return;
        }
        // eslint-disable-next-line no-labels
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        const audience = state.selectedJournalists.map((j) => { return {email: j.email} });
        console.log("journaliist!!!!--!!", state.selectedJournalists)
        console.log("journaliist", audience)
        setState({...state, releaseLoading: true});

        const ok = await sendRelease({
            orderId: state.order.id,
            audience: audience,
        });

        setState({...state, releaseLoading: false});

        if (ok) {
            toast("Release sent", {type: "success"});
        } else {
            toast("Something went wrong", {type: "error"})
        }
    }

    const handleSelectionChange = (config: TypeOnSelectionChangeArg) => {
        if (config.selected === true && config.data) {
            const rows = convertJournalistsToRows(config.data as Journalist[]);
            updateSelectedJournalists(rows, Object.values(config.data));
        } else if (config.selected) {
            updateSelectedJournalists(config.selected, Object.values(config.selected));
        }
    }

    const sendForApproval = async () => {
        if (!state.order) {
            return;
        }

        setState({...state, sendForApprovalLoading: true});

        const ok = await postNotifyUser({orderId: state.order.id});

        // TODO: email user

        setState({...state, sendForApprovalLoading: false});

        if (ok) {
            toast("Release sent for approval", {type: "success"});
        } else {
            toast("Something went wrong", {type: "error"})
        }
    }

    const handleAudienceApprovedOnChange = (next: React.ChangeEvent<HTMLInputElement>) => {
        setState({...state, audienceApproved: next.target.checked});
    }

    const handleDialogOnClose = () => {
        setState({...state, approveScheduleDialogOpen: false});
    }

    const handleScheduledForOnChange = (next: string | Moment) => {
        if (typeof next !== "string") {
            setState({...state, scheduledFor: next.toDate()});
        }
    }

    return <div style={{padding: "25px", marginTop: "50px"}}>
                {console.log("aa o", state.order)}
        {console.log("aa r", state.release)}
        {console.log("aa j", state.allJournalists)}
        {        console.log("aa s", state)}

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
                    onClick={attemptScheduleRelease}
                >
                    {state.loading ? "Loading" : "Confirm"}
                </Button>
                <Button onClick={handleDialogOnClose}>Cancel</Button>
            </DialogActions>
        </Dialog>

        <h1 style={{textAlign: "left"}}>Manage press releases</h1>

        <Grid container spacing={3} style={{marginTop: "50px"}}>
            <Grid item xs={6}>
                <div className="margin-v-md">

                    <h2 style={{textAlign: "left"}}>Audience</h2>

                    <h4>Original filters</h4>

                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    Job titles
                                </TableCell>
                                <TableCell>
                                    {state.order?.filters?.jobTitles.join(", ")}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    Outlet Types
                                </TableCell>
                                <TableCell>
                                    {state.order?.filters?.outletTypes.join(", ")}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    Outlets
                                </TableCell>
                                <TableCell>
                                    {state.order?.filters?.outlets.join(", ")}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    Sectors
                                </TableCell>
                                <TableCell>
                                    {state.order?.filters?.sectors.join(", ")}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <h4>Save audience</h4>

                    <div className="flex-row margin-h-md">
                        <Button
                            color={"primary"}
                            disableElevation
                            variant={"contained"}
                            disabled={!state.order || !state.user || state.saveAudienceLoading}
                            onClick={saveAudience}
                        >
                            {state.saveAudienceLoading ? "Loading" : "Save selected journalists"}
                        </Button>
                    </div>

                    <ReactDataGrid
                        defaultFilterValue={filterValue}
                        /*
                        // @ts-ignore */
                        filterTypes={filterTypes}
                        style={{height: "100%", minHeight: "60vh"}}
                        dataSource={state.allJournalists}
                        columns={state.columns}
                        pagination={"local"}
                        multiSelect
                        checkboxColumn
                        defaultLimit={5000}
                        onSelectionChange={handleSelectionChange}
                        selected={state.selectedRows}
                    />
                </div>
            </Grid>

            <Grid item xs={6}>
                <div className={"margin-v-md"}>
                    <h2 style={{textAlign: "left"}}>Release</h2>

                    <div className="flex-row margin-h-md">
                        <h4>Choose user</h4>

                        <div style={{width: "250px", zIndex: 100}}>
                            <Select
                                options={state.users}
                                onChange={e => setState({...state, user: e?.value || null})}
                            />
                        </div>

                        <h4>Choose order</h4>

                        <div style={{width: "250px", zIndex: 100}}>
                            <Select
                                options={usersOrdersOptions}
                                onChange={handleOrderNumberOnChange}
                            />
                        </div>

                    </div>

                    {state.order && <h5>Current status: {state.order?.orderStatus}</h5>}

                    {state.order && <div className="flex-row">
                        Audience approved: {state.order?.audienceApproved}
                        <Checkbox checked={state.audienceApproved} onChange={handleAudienceApprovedOnChange}/>
                    </div>}

                    <div className="flex-row">
                        <TextField
                            fullWidth
                            label={"Email subject"}
                            variant={"outlined"}
                            value={state.subject}
                            onChange={e => setState({...state, subject: e.target.value})}
                        />
                    </div>

                    <div className="flex-row">
                        <TextField
                            fullWidth
                            label={"Reply to"}
                            variant={"outlined"}
                            value={state.replyTo}
                            onChange={e => setState({...state, replyTo: e.target.value})}
                        />
                    </div>

                    <div className="flex-row">
                        {/* <RichTextEditor
                            rootStyle={{width: "100%"}}
                            value={state.release}
                            onChange={v => setState({...state, release: v})}
                        /> */}
                        {console.log("pre check state!!!--", state)}
                        <Editor value={state.release}  onChange={v => {setRelease(v,state)} }  parentState={state} />
                       
                    </div>

                    <div className="flex-row">
                        <Button
                            fullWidth
                            variant={"contained"}
                            color={"primary"}
                            disableElevation
                            disabled={state.uploadLoading || !state.order}
                            onClick={uploadRelease}
                        >
                            {state.uploadLoading ? "Loading" : "Save release"}
                        </Button>
                    </div>

                    <div className="flex-row">
                        <Button
                            fullWidth
                            variant={"contained"}
                            color={"primary"}
                            disableElevation
                            disabled={state.uploadLoading || !state.subject || !state.replyTo || !state.order || state.sendForApprovalLoading}
                            onClick={sendForApproval}
                        >
                            {state.sendForApprovalLoading ? "Loading" : "Notify user"}
                        </Button>
                    </div>
                </div>
            </Grid>

            <Grid item xs={12}>
                <div className={"margin-v-md"}>
                    <h4>Send to {state.selectedJournalists.length} journalists</h4>

                    <div className={"flex-row margin-h-md"}>
                        <div>
                            <Button
                                variant={"contained"}
                                disableElevation
                                color={"primary"}
                                onClick={attemptSendTestRelease}
                                disabled={state.testReleaseLoading || !state.release.toString() || !state.subject || !state.replyTo}
                            >
                                Send test
                            </Button>
                        </div>

                        <div>
                            <Button
                                variant={"contained"}
                                disableElevation
                                color={"primary"}
                                onClick={attemptSendRelease}
                                disabled={state.order?.processing || state.releaseLoading || !state.release.toString() || !state.subject || !state.replyTo || state.selectedJournalists.length === 0}
                            >
                                Send release
                            </Button>
                        </div>

                        <div>
                            <Button
                                variant={"contained"}
                                disableElevation
                                color={"primary"}
                                onClick={() => setState({...state, approveScheduleDialogOpen: true})}
                                disabled={state.releaseLoading || !state.release.toString() || !state.subject || !state.replyTo || state.selectedJournalists.length === 0}
                            >
                                Schedule release
                            </Button>
                        </div>
                    </div>

                    {state.releaseLoading || state.testReleaseLoading && <LinearProgress/>}
                </div>
            </Grid>
        </Grid>
    </div>
}

export default SendPressReleaseComponent;
