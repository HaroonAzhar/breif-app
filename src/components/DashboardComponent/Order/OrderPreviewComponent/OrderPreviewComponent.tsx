import styles from "./styles.module.css";
import React, {useEffect, useState} from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    LinearProgress,
    List, ListItem, ListItemSecondaryAction,
    ListItemText,
    Menu,
    MenuItem,
    Typography
} from "@material-ui/core";
import {Order, OrderStatus, orderStatusToString} from "../../../../types/order";
import {useHistory} from "react-router-dom";
import {ArrowDownwardOutlined, CloseOutlined, MenuOutlined} from "@material-ui/icons";
import {
    getAudienceAnalysisFilters,
    postAnalysePressPressRelease,
    postSaveAudienceFromFilters,
    postSendTestRelease,
    updateMyOrder
} from "../../../../app/api";
import {toast} from "react-toastify";
import Datetime from "react-datetime";
import {Moment} from "moment";
import Select from "react-select";
import {Journalist} from "../../../../types/journalist";

interface State {
    editDialogOpen: boolean;
    confirmCancelDialogOpen: boolean;
    loading: boolean;
    rescheduleDialogOpen: boolean;
    scheduledFor: Date;
    filters: any | null;
    editAudienceDialogOpen: boolean;
    journalistFilterValues: { sectors: string[], outlets: string[], outletTypes: string[], jobTitles: string[] };
    audienceResult: { journalistCount: number, sectors: string[], outlets: string[], outletTypes: string[], jobTitles: string[], journalists: Journalist[], totalCount: number };
    anchorEl: HTMLElement | null;
    currentPage: number;
    journalistsToRemove: Journalist[]
}

const OrderPreviewComponent = ({order}: { order: Order }) => {
    const history = useHistory();

    console.log("LOADED: ", order.filters)

    const [state, setState] = useState<State>({
        editDialogOpen: false,
        confirmCancelDialogOpen: false,
        loading: false,
        rescheduleDialogOpen: false,
        scheduledFor: order.scheduledFor,
        filters: null,
        editAudienceDialogOpen: false,
        journalistFilterValues: order.filters || {sectors: [], outlets: [], outletTypes: [], jobTitles: []},
        audienceResult: {journalistCount: 0, outletTypes: [], jobTitles: [], sectors: [], outlets: [], journalists: [], totalCount: 0},
        anchorEl: null,
        currentPage: 1,
        journalistsToRemove: []
    });

    console.log("STATE: ", state.journalistFilterValues);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setState({...state, anchorEl: event.currentTarget});
    };

    const handleMenuClose = () => {
        setState({...state, anchorEl: null});
    }

    const removeJournalist = (journalist: Journalist) => {
        setState({
            ...state,
            journalistsToRemove: [...state.journalistsToRemove, journalist],
            audienceResult: {
                ...state.audienceResult,
                journalists: state.audienceResult.journalists.filter(j => j.id !== journalist.id)
            }
        });
    }

    const loadItems = () => {
        setState({...state, loading: true});
        postAnalysePressPressRelease({filters: state.journalistFilterValues, page: state.currentPage}).then(response => {
            console.log("Loading more")
            if (response) {
                setState({
                    ...state,
                    audienceResult: {
                        ...response,
                        journalists: state.audienceResult.journalists.concat(response.journalists),
                        sectors: state.journalistFilterValues.sectors,
                        outlets: state.journalistFilterValues.outlets,
                        jobTitles: state.journalistFilterValues.jobTitles,
                        outletTypes: state.journalistFilterValues.outletTypes
                    },
                    currentPage: state.currentPage + 1,
                    loading: false
                });

            } else {
                toast("Something went wrong.", {type: "error"});
            }
        });
    }

    const onClick = () => {
        setState({...state, loading: true});
        postAnalysePressPressRelease({filters: state.journalistFilterValues, page: 0}).then(response => {
            if (response) {
                setState({
                    ...state,
                    audienceResult: {
                        ...response,
                        sectors: state.journalistFilterValues.sectors,
                        outlets: state.journalistFilterValues.outlets,
                        jobTitles: state.journalistFilterValues.jobTitles,
                        outletTypes: state.journalistFilterValues.outletTypes
                    },
                    loading: false
                });

            } else {
                toast("Something went wrong.", {type: "error"});
            }
        });
    }

    useEffect(() => {
        // If the dialog is open
        if (state.editAudienceDialogOpen) {
            // TODO: extract this to function
            // TODO: create type for filters
            getAudienceAnalysisFilters().then(data => {
                if (!data) {
                    return;
                }

                const {sectors, jobTitles, outlets, outletTypes} = data;


                const sectorOptions = sectors.sort((a: string, b: string) => a.localeCompare(b)).map((sector: string) => {
                    return {
                        value: sector,
                        label: sector
                    }
                });

                const jobTitleOptions = jobTitles.filter((a: string | null) => !!a).sort((a: string, b: string) => a.localeCompare(b)).map((sector: string) => {
                    return {
                        value: sector,
                        label: sector
                    }
                });

                const outletOptions = outlets.sort((a: string, b: string) => a.localeCompare(b)).map((sector: string) => {
                    return {
                        value: sector,
                        label: sector
                    }
                });

                const outletTypeOptions = outletTypes.sort((a: string, b: string) => a.localeCompare(b)).map((sector: string) => {
                    return {
                        value: sector,
                        label: sector
                    }
                });

                setState({
                    ...state,
                    filters: {
                        jobTitles: jobTitleOptions,
                        outletTypes: outletTypeOptions,
                        outlets: outletOptions,
                        sectors: sectorOptions
                    }
                });
            });
        }
    }, [state.editAudienceDialogOpen]);

    const date = new Date(order.createdAt);

    const handleEditButtonOnClick = () => {
        setState({...state, editDialogOpen: true});
    }

    const handleDialogOnClose = () => {
        setState({...state, editDialogOpen: false});
    }

    const handleConfirmCancelDialogOnClose = () => {
        setState({...state, confirmCancelDialogOpen: false});
    }

    const handleCancelReleaseOnClick = () => {
        setState({...state, confirmCancelDialogOpen: true, editDialogOpen: false});
    }

    const handleConfirmCancelOnClick = async () => {
        setState({...state, loading: true});

        const ok = await updateMyOrder(order.id, {orderStatus: OrderStatus.WAITING_APPROVAL});

        setState({...state, loading: false});

        if (ok) {
            toast("Scheduled release cancelled", {type: "success"});

            closeAllDialogs();
        } else {
            toast("Something went wrong", {type: "error"});
        }
    }

    const handleRescheduleOnClick = () => {
        setState({...state, rescheduleDialogOpen: true});
    }

    const handleRescheduleConfirmOnClick = async () => {
        setState({...state, loading: true});

        const ok = await updateMyOrder(order.id, {scheduledFor: state.scheduledFor.toISOString()});

        setState({...state, loading: false});

        if (ok) {
            toast("Scheduled release rescheduled", {type: "success"});

            closeAllDialogs();
        } else {
            toast("Something went wrong", {type: "error"});
        }
    }

    const handleRescheduleDialogOnClose = () => {
        setState({...state, rescheduleDialogOpen: false});
    }

    const closeAllDialogs = () => {
        setState({
            ...state,
            confirmCancelDialogOpen: false,
            editDialogOpen: false,
            rescheduleDialogOpen: false,
            editAudienceDialogOpen: false
        });
    }

    let delivered = 0;
    let clicked = 0;
    let opened = 0;

    order.orderDistributions?.map(d => {
        delivered += Number(d.delivered);
        clicked += Number(d.clicked);
        opened += Number(d.opened);
    });

    const handleScheduledForOnChange = (next: string | Moment) => {
        if (typeof next !== "string") {
            setState({...state, scheduledFor: next.toDate()});
        }
    }

    const handleEditAudienceOnClick = () => {
        setState({...state, editAudienceDialogOpen: true});
    }

    const handleEditAudienceDialogOnClose = () => {
        setState({...state, editAudienceDialogOpen: false});
    }

    const handleAnalyseOnClick = async () => {
        if (!state.journalistFilterValues) {
            return;
        }

        setState({...state, loading: true});
        const response = await postAnalysePressPressRelease({filters: state.journalistFilterValues});
        setState({...state, loading: false});

        if (response) {
            setState({
                ...state,
                audienceResult: {
                    ...response,
                    outlets: state.journalistFilterValues.outlets,
                    outletTypes: state.journalistFilterValues.outletTypes,
                    jobTitles: state.journalistFilterValues.jobTitles,
                    sectors: state.journalistFilterValues.sectors,
                }
            });
        } else {
            toast("Something went wrong.", {type: "error"});
        }


    }

    const handleSaveOnClick = async () => {
        setState({...state, loading: true});
        const ok = await postSaveAudienceFromFilters({orderId: order.id, filters: state.journalistFilterValues, journalistsToRemove: state.journalistsToRemove});
        setState({...state, loading: false});

        if (ok) {
            toast("Audience saved!", {type: "success"});
        } else {
            toast("Something went wrong.", {type: "error"});
        }
    }

    const handleSendTestReleaseOnClick = async () => {
        setState({...state, loading: true});
        const ok = await postSendTestRelease({orderId: order.id});
        setState({...state, loading: false});

        if (ok) {
            toast("Test release send! Check your email.", {type: "success"});
        } else {
            toast("Something went wrong.", {type: "error"});
        }
    }

    return <>
        <Dialog open={state.editAudienceDialogOpen} onClose={handleEditAudienceDialogOnClose}>
            <DialogTitle>Edit audience</DialogTitle>

            <DialogContent style={{height: "fit-content"}}>
                <div className={"margin-v-md"}>
                    <h3>Current audience</h3>

                    <h4>{order.audience.length} Journalists reached.</h4>

                    {!state.filters && <LinearProgress/>}

                    {state.filters && <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <Typography variant={"body2"} align={"left"}>
                                Find out who you could reach with your press release using the following filters.
                                Leave blank for all or select multiple to widen range.
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <span>Outlet types</span>
                            <Select
                                options={state.filters.outletTypes}
                                isMulti
                                value={state.journalistFilterValues.outletTypes.map(v => ({label: v, value: v}))}
                                onChange={e => setState({
                                    ...state,
                                    journalistFilterValues: {
                                        ...state.journalistFilterValues,
                                        outletTypes: e.map(s => s.value)
                                    }
                                })}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <span>Sectors</span>
                            <Select
                                options={state.filters.sectors}
                                isMulti
                                value={state.journalistFilterValues.sectors.map(v => ({label: v, value: v}))}
                                onChange={e => setState({
                                    ...state,
                                    journalistFilterValues: {
                                        ...state.journalistFilterValues,
                                        sectors: e.map(s => s.value)
                                    }
                                })}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <span>Job titles</span>
                            <Select
                                options={state.filters.jobTitles}
                                isMulti
                                value={state.journalistFilterValues.jobTitles.map(v => ({label: v, value: v}))}
                                onChange={e => setState({
                                    ...state,
                                    journalistFilterValues: {
                                        ...state.journalistFilterValues,
                                        jobTitles: e.map(s => s.value)
                                    }
                                })}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <span>Outlets</span>
                            <Select
                                options={state.filters.outlets}
                                isMulti
                                value={state.journalistFilterValues.outlets.map(v => ({label: v, value: v}))}
                                onChange={e => setState({
                                    ...state,
                                    journalistFilterValues: {
                                        ...state.journalistFilterValues,
                                        outlets: e.map(s => s.value)
                                    }
                                })}
                            />
                        </Grid>
                    </Grid>}

                    {state.audienceResult && state.audienceResult.journalistCount > 0 && !state.loading &&
                    <Grid item xs={12}>
                        <h3>New audience</h3>
                        <h4>{state.audienceResult.totalCount} Journalists reached.</h4>

                        {state.audienceResult.sectors.length > 0 && <div>
                            <h4>In {state.audienceResult.sectors.length} Sectors:</h4>

                            <ul>
                                {state.audienceResult.sectors.map(sector => <li>{sector}</li>)}
                            </ul>
                        </div>}

                        {state.audienceResult.outlets.length > 0 && <div>
                            <h4>Featuring publications such as:</h4>

                            <ul>
                                {state.audienceResult.outlets.map(outlet => <li>{outlet}</li>)}
                            </ul>
                        </div>}

                        {state.audienceResult.jobTitles.length > 0 && <div>
                            <h4>Featuring job titles such as:</h4>

                            <ul>
                                {state.audienceResult.jobTitles.map(jobTitle => <li>{jobTitle}</li>)}
                            </ul>
                        </div>}

                        {state.audienceResult.outletTypes.length > 0 && <div>
                            <h4>Featuring outlet types such as:</h4>

                            <ul>
                                {state.audienceResult.outletTypes.map(outletType => <li>{outletType}</li>)}
                            </ul>
                        </div>}
                    </Grid>}

                    <Grid item xs={12} style={{maxHeight: "300px", overflow: "scroll"}}>
                        <List>
                            {state.audienceResult.journalists.map(journalist => <ListItem>
                                <ListItemText primary={`${journalist.firstName} ${journalist.lastName}`} secondary={journalist.outlet}/>
                                <ListItemSecondaryAction>
                                    <IconButton onClick={() => removeJournalist(journalist)}>
                                        <CloseOutlined/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>)}
                        </List>

                        {state.loading && <h4>Loading...</h4>}

                        {state.audienceResult.journalists.length < state.audienceResult.totalCount  && <Button onClick={loadItems}>Load more</Button>}
                    </Grid>
                </div>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onClick}
                    variant={"contained"}
                    color={"primary"}
                    disableElevation
                    disabled={state.loading}
                >
                    Manage
                </Button>
                <Button
                    onClick={handleSaveOnClick}
                    variant={"contained"}
                    color={"primary"}
                    disableElevation
                    disabled={state.loading}
                >
                    Update
                </Button>
                <Button
                    onClick={closeAllDialogs}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>

        <Dialog open={state.rescheduleDialogOpen} onClose={handleRescheduleDialogOnClose}>
            <DialogTitle>Choose a new date and time to sent out your release</DialogTitle>

            <DialogContent style={{height: "fit-content"}}>
                <div className="margin-v-md">
                    <h4>Pick a new date and time</h4>

                    <Datetime value={state.scheduledFor} onChange={handleScheduledForOnChange}/>
                </div>
            </DialogContent>

            <DialogActions>
                <Button
                    variant={"contained"}
                    disableElevation
                    onClick={handleRescheduleConfirmOnClick}
                >
                    Confirm
                </Button>

                <div className={"align-right"}>
                    <Button onClick={closeAllDialogs}>Cancel</Button>
                </div>
            </DialogActions>
        </Dialog>

        <Dialog open={state.confirmCancelDialogOpen} onClose={handleConfirmCancelDialogOnClose}>
            <DialogTitle>Are you sure you want to cancel your scheduled release?</DialogTitle>

            <DialogContent>
                Once the release is cancelled it will appear again in 'Current orders' and you can reschedule at any
                time.
            </DialogContent>

            <DialogActions>
                <Button
                    variant={"contained"}
                    disableElevation
                    onClick={handleConfirmCancelOnClick}
                >
                    Confirm
                </Button>

                <div className={"align-right"}>
                    <Button onClick={closeAllDialogs}>Cancel</Button>
                </div>
            </DialogActions>
        </Dialog>

        <Dialog open={state.editDialogOpen} onClose={handleDialogOnClose}>
            <DialogTitle>Edit or cancel your scheduled release</DialogTitle>

            <DialogContent>
                Your release is currently scheduled
                for: {order.scheduledFor.toDateString()} at {order.scheduledFor.toLocaleTimeString()}.

                <span className="bold"> You can reschedule or cancel a release up to 15 minutes before the original time.</span>
            </DialogContent>

            <DialogActions>
                <Button
                    variant={"contained"}
                    disableElevation
                    onClick={handleRescheduleOnClick}
                >
                    Reschedule
                </Button>
                <Button
                    variant={"contained"}
                    disableElevation
                    onClick={handleCancelReleaseOnClick}
                >
                    Cancel scheduled release
                </Button>

                <div className="align-right">
                    <Button>Close</Button>
                </div>
            </DialogActions>
        </Dialog>

        <Accordion className={styles.wrapper}>
            <AccordionSummary>
                <div className={"flex-row margin-h-md"}>
                    <ArrowDownwardOutlined/>
                    <span>Click to expand</span>
                    <span>{order.orderNumber}</span>

                    <span className={styles.package}>{order.orderInfo.selectedPackage?.name}</span>

                    <div className={"align-right margin-h-md"}>

                        <Menu
                            open={Boolean(state.anchorEl)}
                            anchorEl={state.anchorEl}
                            keepMounted
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={() => history.push(`/dashboard/analytics/${order.id}`)}>View
                                analytics</MenuItem>

                            {order.orderStatus === "waiting_approval" && <div>
                                <MenuItem disabled={order.processing}
                                          onClick={() => history.push(`/dashboard/order/${order.id}/release`)}>View release
                                    & approve</MenuItem>

                                <MenuItem onClick={handleEditAudienceOnClick}>Edit audience</MenuItem>

                                <MenuItem onClick={handleSendTestReleaseOnClick}>Send test release</MenuItem>

                            </div>}


                            {order.orderStatus === OrderStatus.APPROVED_RELEASE_SCHEDULED &&
                            <MenuItem onClick={handleEditButtonOnClick}>Edit / Cancel scheduled time</MenuItem>}
                        </Menu>

                        <Chip label={orderStatusToString(order.orderStatus)}/>
                        <span className={styles.date}>{date.toDateString()}</span>

                        <p>Last updated : {order.updatedAt.toDateString()} at {order.updatedAt.toLocaleTimeString()}</p>

                        <IconButton onClick={handleClick}>
                            <MenuOutlined/>
                        </IconButton>

                    </div>
                </div>

            </AccordionSummary>

            <AccordionDetails>
                <Grid container>
                    <List className={styles.list}>
                        <ListItemText
                            primary={"Email"}
                            secondary={order.orderInfo.email || "N/A"}
                        />

                        <ListItemText
                            primary={"Package"}
                            secondary={order.orderInfo.selectedPackage?.name || "N/A"}
                        />

                        <ListItemText
                            primary={"Looking to create"}
                            secondary={order.orderInfo.lookingToCreate.join(", ") || "N/A"}
                        />

                        <ListItemText
                            primary={"Purpose of content"}
                            secondary={order.orderInfo.purposeOfContent.join(", ") || "N/A"}
                        />

                        <ListItemText
                            primary={"News hook"}
                            secondary={order.orderInfo.newsHook || "N/A"}
                        />

                        <ListItemText
                            primary={"Quote"}
                            secondary={order.orderInfo.quote || "N/A"}
                        />

                        <ListItemText
                            primary={"Important info"}
                            secondary={order.orderInfo.importantInfo || "N/A"}
                        />

                        <ListItemText
                            primary={"Supporting material"}
                            secondary={order.orderInfo.supportingMaterial.join(", ") || "N/A"}
                        />

                        <ListItemText
                            primary={"Links to media"}
                            secondary={order.orderInfo.linksToMedia.join(", ") || "N/A"}
                        />

                        <ListItemText
                            primary={"Distribution upload"}
                            secondary={order.orderInfo.distributionUpload || "N/A"}
                        />

                        <ListItemText
                            primary={"Audience demographics"}
                            secondary={order.orderInfo.audienceDemographics || "N/A"}
                        />

                        <ListItemText
                            primary={"Audience household income"}
                            secondary={order.orderInfo.audienceHouseholdIncome || "N/A"}
                        />

                        <ListItemText
                            primary={"Audience location"}
                            secondary={order.orderInfo.audienceLocation || "N/A"}
                        />

                        <ListItemText
                            primary={"Audience location regional"}
                            secondary={order.orderInfo.audienceLocationRegional || "N/A"}
                        />

                        <ListItemText
                            primary={"Outlet"}
                            secondary={order.orderInfo.outlet.join(", ") || "N/A"}
                        />

                        <ListItemText
                            primary={"Genre"}
                            secondary={order.orderInfo.genre.join(", ") || "N/A"}
                        />

                        <ListItemText
                            primary={"Publications to ignore"}
                            secondary={order.orderInfo.publicationsToIgnore || "N/A"}
                        />

                        <ListItemText
                            primary={"Release date"}
                            secondary={order.orderInfo.releaseDate || "N/A"}
                        />

                        <ListItemText
                            primary={"Embargo Date"}
                            secondary={order.orderInfo.embargoDate || "N/A"}
                        />

                        <ListItemText
                            primary={"Name"}
                            secondary={order.orderInfo.name || "N/A"}
                        />

                        <ListItemText
                            primary={"Tel"}
                            secondary={order.orderInfo.tel || "N/A"}
                        />

                        <ListItemText
                            primary={"Web"}
                            secondary={order.orderInfo.web || "N/A"}
                        />

                        <ListItemText
                            primary={"Instagram"}
                            secondary={order.orderInfo.instagram || "N/A"}
                        />


                        <ListItemText
                            primary={"Other Socials"}
                            secondary={order.orderInfo.otherSocials || "N/A"}
                        />

                    </List>

                    {// TODO add price back
                    }
                    {/* <Grid item xs={12}>
                    <p className={styles.packageCost}>£ {order.orderInfo.selectedPackage?.cost ? order.orderInfo.selectedPackage?.cost / 100 : 0}</p>
                </Grid> */}
                </Grid>
            </AccordionDetails>
        </Accordion>
    </>
}

export default OrderPreviewComponent;
