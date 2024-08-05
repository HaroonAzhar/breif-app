import React, {useEffect, useState} from "react";
import {Box, Button, Collapse, IconButton, Table, TableBody, TableCell, TableRow, Typography} from "@material-ui/core";
import {KeyboardArrowDown, KeyboardArrowUp} from "@material-ui/icons";
import {User} from "../../../../../types/user";
import OrderPreviewComponent from "../../../../DashboardComponent/Order/OrderPreviewComponent/OrderPreviewComponent";
import {postDistributionStatsFileUpload} from "../../../../../app/api";
import {toast} from "react-toastify";
import {Order} from "../../../../../types/order";
import {useHistory} from "react-router-dom";

const Row = ({user, openNotifyDialog}: { user: User, openNotifyDialog: (user: User, order: Order) => void }) => {
    const [open, setOpen] = useState(false);
    const [distributionStats, setDistributionStats] = useState<File | null>(null);

    const [coverageTotals, setCoverageTotals] = useState<{ readership: number, estimatedValue: number }>({
        readership: 0,
        estimatedValue: 0
    });

    const history = useHistory();

    useEffect(() => {
        let readership = 0;
        let estimatedValue = 0;
        user.pressCoverage.forEach(pressCoverage => {
            readership += pressCoverage.readership;
            estimatedValue += pressCoverage.ave;
        });

        setCoverageTotals({readership, estimatedValue});
    }, []);

    const uploadDistributionOnClick = async (orderId: number) => {
        if (distributionStats) {
            await postDistributionStatsFileUpload(distributionStats, orderId);
        }

        toast("Success");
    }

    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {user.username}
                </TableCell>
                <TableCell align="right">{user.email}</TableCell>
                <TableCell align="right">{user.business}</TableCell>
                <TableCell align="right">{user.subscription}</TableCell>
                <TableCell align="right">{user.name}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant={"h6"} gutterBottom>
                                Press coverage
                            </Typography>

                            <Table>
                                <TableRow>
                                    <TableCell>
                                        Total Readership
                                    </TableCell>

                                    <TableCell>
                                        {coverageTotals.readership}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        Estimated Value
                                    </TableCell>

                                    <TableCell>
                                        £{coverageTotals.estimatedValue}
                                    </TableCell>
                                </TableRow>
                            </Table>

                            <Typography variant="h6" gutterBottom component="div">
                                Distributions
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableBody>
                                    {user?.distributions?.map((distribution: Order, i) => (
                                        <div key={i}>
                                            <OrderPreviewComponent order={distribution}/>

                                            Upload distribution stats <input type="file"
                                                                             onChange={(file) => setDistributionStats(file.target.files && file.target.files[0])}/>

                                            {distribution.orderDistributions?.map(d =>

                                                <span>{d.file.name}, </span>)}<br/>

                                            <div className={"flex-row margin-h-md"}>
                                                <Button variant={"contained"} disableElevation
                                                        onClick={() => uploadDistributionOnClick(distribution.id)}>Upload</Button>

                                                <Button variant={"contained"} color={"primary"} disableElevation
                                                        onClick={() => openNotifyDialog(user, distribution)}>Notify</Button>
                                            </div>

                                            <br/>
                                        </div>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default Row;
