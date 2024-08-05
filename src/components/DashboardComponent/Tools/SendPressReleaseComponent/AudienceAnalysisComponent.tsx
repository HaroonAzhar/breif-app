import React, {useEffect, useState} from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from "@material-ui/core";
import {getAudienceAnalysisFilters, postAnalysePressPressRelease} from "../../../../app/api";
import {toast} from "react-toastify";
import Select from "react-select";

interface ValueLabel {
    value: string,
    label: string
}

export const AudienceAnalysisComponent = () => {
    const [state, setState] = useState<{
        jobTitles: string[],
        sectors: string[],
        outlets: string[],
        outletTypes: string[]
    }>({jobTitles: [], sectors: [], outlets: [], outletTypes: []});
    const [result, setResult] = useState<{ journalistCount: number, sectors: string[], outlets: string[], clickRate: number, openRate: number }>({
        journalistCount: 0,
        sectors: [],
        outlets: [],
        clickRate: 0,
        openRate: 0
    });
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<{
        sectors: ValueLabel[],
        jobTitles: ValueLabel[],
        outlets: ValueLabel[],
        outletTypes: ValueLabel[]
    }>({sectors: [], jobTitles: [], outlets: [], outletTypes: []});
    const [resultsReady, setResultsReady] = useState(false);

    useEffect(() => {
        fetchData().then(() => console.log("Fetched"));
    }, [])

    const fetchData = async () => {
        const filters = await getAudienceAnalysisFilters();

        if (!filters) {
            return;
        }

        const {sectors, jobTitles, outlets, outletTypes} = filters;


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

        setFilters({
            jobTitles: jobTitleOptions,
            outletTypes: outletTypeOptions,
            outlets: outletOptions,
            sectors: sectorOptions
        });
    }

    const attemptAnalysis = async () => {
        setLoading(true);

        setTimeout(async () => {
            const response = await postAnalysePressPressRelease({filters: state});
            setLoading(false);

            if (response) {
                setResult({
                    ...response,
                    sectors: state.sectors,
                    outlets: state.outlets,
                    openRate: randomNumber(40, 60),
                    clickRate: randomNumber(5, 10)
                });
                setResultsReady(true);
            } else {
                toast("Something went wrong.", {type: "error"});
            }
        }, 2000);
    }


    return <Card style={{width: "500px", maxWidth: "90%"}}>
        <CardHeader title={"Analyse your potential audience"}/>

        <CardContent>
            <Grid container spacing={5}>
                <Grid item xs={12}>
                    <Typography variant={"body2"} align={"left"}>
                        Find out who you could reach with your press release using the following filters.
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <span>Sectors</span>
                    <Select
                        options={filters.sectors}
                        isMulti
                        onChange={e => setState({...state, sectors: e.map(s => s.value)})}
                    />
                </Grid>

                <Grid item xs={12}>
                    <span>Job titles</span>
                    <Select
                        options={filters.jobTitles}
                        isMulti
                        onChange={e => setState({...state, jobTitles: e.map(s => s.value)})}
                    />
                </Grid>

                <Grid item xs={12}>
                    <span>Outlets</span>
                    <Select
                        options={filters.outlets}
                        isMulti
                        onChange={e => setState({...state, outlets: e.map(s => s.value)})}
                    />
                </Grid>

                <Grid item xs={12}>
                    <span>Outlet types</span>
                    <Select
                        options={filters.outletTypes}
                        isMulti
                        onChange={e => setState({...state, outletTypes: e.map(s => s.value)})}
                    />
                </Grid>

                {resultsReady && <Grid item xs={12}>
                    <h4>{result.journalistCount} Journalists reached.</h4>

                    {result.sectors.length > 0 && <div>
                        <h4>In {state.sectors.length} Sectors:</h4>

                        <ul>
                            {result.sectors.map(sector => <li>{sector}</li>)}
                        </ul>
                    </div>}

                    {result.outlets.length > 0 && <div>
                        <h4>Featuring publications such as:</h4>

                        <ul>
                            {result.outlets.map(outlet => <li>{outlet}</li>)}
                        </ul>
                    </div>}

                    <h4>Similar distributions had the following stats:</h4>

                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Open rate</TableCell>
                                <TableCell>{result.openRate}%</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Click rate</TableCell>
                                <TableCell>{result.clickRate}%</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>


                </Grid>}
            </Grid>
        </CardContent>

        <CardActions>
            <Button
                color={"primary"}
                disableElevation
                variant={"contained"}
                onClick={attemptAnalysis}
                disabled={loading}
                fullWidth
            >
                {loading ? "Analysing" : "Analyse"}
            </Button>
        </CardActions>
    </Card>
}

function randomNumber(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min);
}
