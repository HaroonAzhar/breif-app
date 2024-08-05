import React, {useContext, useEffect, useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    LinearProgress, ListItem, ListItemSecondaryAction, ListItemText,
    Typography
} from "@material-ui/core";
import Select from "react-select";
import {Journalist} from "../../types/journalist";
import {getAudienceAnalysisFilters, postAnalysePressPressRelease} from "../../app/api";
import {toast} from "react-toastify";
import {FixedSizeList} from "react-window";
import UserContext from "../../Context/UserContext";

interface State {
    filters: any | null;
    audienceResult: {
        journalistCount: number,
        sectors: string[],
        outlets: string[],
        outletTypes: string[],
        jobTitles: string[],
        journalists: Journalist[],
        totalCount: number
    };
    journalistFilterValues: {
        sectors: string[],
        outlets: string[],
        outletTypes: string[],
        jobTitles: string[]
    };
    loading: boolean;
}

export const FindJournalistDialog = ({open, setOpen}: {open: boolean, setOpen: (next: boolean) => void}) => {
    const {user} = useContext(UserContext);

    const [state, setState] = useState<State>({
        audienceResult: {
            jobTitles: [],
            journalistCount: 0,
            journalists: [],
            outletTypes: [],
            outlets: [],
            sectors: [],
            totalCount: 0,
        },
        filters: null,
        journalistFilterValues: {sectors: [], outlets: [], outletTypes: [], jobTitles: []},
        loading: false
    });

    useEffect(() => {
        if (open) {
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
    }, [open]);

    const onClick = () => {
        setState({...state, loading: true});
        postAnalysePressPressRelease({filters: state.journalistFilterValues}).then(response => {
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

    const Row = ({ index, style }: any) => {
        const journalist = state.audienceResult.journalists[index];

        if (!journalist) {
            return <div/>;
        }

        if (!user?.subscription) {
            return <div style={style} className={"flex-row margin-h-md"}>
                <span>{journalist.firstName} {journalist.lastName} at {journalist.outlet}</span>
            </div>
        }

        return <ListItem style={style}>
            <ListItemText primary={`${journalist.firstName} ${journalist.lastName}`} secondary={`${journalist.jobTitle} at ${journalist.outlet}`}/>
            <ListItemSecondaryAction>
                <Button variant={"outlined"} color={"primary"} href={`mailto:${journalist.email}`}>Contact</Button>
            </ListItemSecondaryAction>
            <Button style={{opacity: 0}}/>
        </ListItem>

    };

    return <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Find a journalist</DialogTitle>
        <DialogContent>
            {!state.filters && <LinearProgress/>}

            {state.filters && <Grid container spacing={5}>
                <Grid item xs={12}>
                    <Typography variant={"body2"} align={"left"}>
                        Find and contact a particular journalist using the filters below.
                    </Typography>
                </Grid>

                {state.filters && <Grid item xs={12}>
                    <span>Outlet types</span>
                    <Select
                        options={state.filters.outletTypes}
                        isMulti
                        onChange={e => setState({
                            ...state,
                            journalistFilterValues: {
                                ...state.journalistFilterValues,
                                outletTypes: e.map(s => s.value)
                            }
                        })}
                    />
                </Grid>}

                <Grid item xs={12}>
                    <span>Sectors</span>
                    <Select
                        options={state.filters.sectors}
                        isMulti
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
                        onChange={e => setState({
                            ...state,
                            journalistFilterValues: {
                                ...state.journalistFilterValues,
                                outlets: e.map(s => s.value)
                            }
                        })}
                    />
                </Grid>

                {!user?.subscription && <Grid item xs={12}>
                    <span>This feature is only available to premium users.</span>
                </Grid>}

                <Grid item xs={12} className={!user?.subscription ? "blur" : ""}>
                    <FixedSizeList height={200} itemCount={state.audienceResult.journalists.length} itemSize={80} width={500}>
                        {Row}
                    </FixedSizeList>
                </Grid>
            </Grid>}
        </DialogContent>
        <DialogActions>
            <Button variant={"contained"} disableElevation color={"primary"} onClick={onClick}>Search</Button>
            <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
    </Dialog>
}
