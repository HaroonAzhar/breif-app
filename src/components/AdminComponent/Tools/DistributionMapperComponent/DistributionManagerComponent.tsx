import React, {useContext, useEffect, useState} from "react";
import styles from "./styles.module.css";
import {
    graphqlQuery,
    sendJournalistAssignedEmail,
    sendPressCoverageEmail,
    sendReleaseDistributedEmail,
    sendReleaseScheduledEmail
} from "../../../../app/api";
import {User, UserMapper} from "../../../../types/user";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid, LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@material-ui/core";
import Row from "./Table/RowComponent";
import UserContext from "../../../../Context/UserContext";
import {useHistory} from "react-router-dom";
import {Order} from "../../../../types/order";
import {toast} from "react-toastify";

const DistributionManagerComponent = () => {
    const [users, setUsers] = useState([] as User[]);
    const {user} = useContext(UserContext);
    const history = useHistory();

    const [notifyDialogOpen, setNotifyDialogOpen] = useState(false);

    const [notifyData, setNotifyData] = useState<{ user: User, order: Order } | undefined>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user?.admin) {
            history.push("/");
        }

        // getUsers().then(users => {
        //     setUsers(users.map((u: any) => UserMapper(u)));
        // });

        const query = `query test {
            users {
              id,
              username,
              email,
              company,
              website,
              name,
              role {
                type
              },
              activeSubscription,
              stripeCustomer,
              orders {
                id,
                orderNumber,
                orderStatus,
                orderInfo,
                created_at,
                user {
                  id
                },
                supportingMaterial {
                  name,
                  url
                },
                release {
                  name,
                  url
                }
                order_distributions {
                  id,
                  delivered,
                  opened,
                  clicked,
                  file {
                    name
                  }
                }
              },
              pressCoverage {
                name,
                url,
                seoRanking,
                circulation,
                readership,
                ave,
                thumbnail {
                    url
                }
              }
            }
          }`;

        setLoading(true);
        graphqlQuery(query).then(response => {
            setUsers(response.data.users.map((e: any) => UserMapper(e)).sort((a: User, b: User) => a.email ? a.email.localeCompare(b.email || "") : 0));
            setLoading(false);
        });
    }, [history, user]);

    const openNotifyDialog = (user: User, order: Order) => {
        setNotifyDialogOpen(true);
        setNotifyData({user, order});
    }

    const [journalistName, setJournalistName] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [journalists, setJournalists] = useState("");

    const [journalistAssignedSending, setJournalistAssignedSending] = useState(false);
    const [releaseScheduledSending, setReleaseScheduledSending] = useState(false);
    const [releaseDistributedSending, setReleaseDistributedSending] = useState(false);
    const [newPressCoverageSending, setNewPressCoverageSending] = useState(false);

    const sendJournalistAssigned = () => {
        if (!notifyData) return;

        setJournalistAssignedSending(true);

        sendJournalistAssignedEmail({journalistName, order: notifyData.order, user: notifyData.user}).then(response => {
            toast("User notified", {type: "success"});
            setJournalistAssignedSending(false);
        }).catch(error => {
            toast(error.message, {type: "error"});
            setJournalistAssignedSending(false);
        });
    }
    const sendReleaseScheduled = () => {
        if (!notifyData) return;

        setReleaseScheduledSending(true);

        sendReleaseScheduledEmail({date, time, order: notifyData.order, user: notifyData.user}).then(response => {
            toast("User notified", {type: "success"});
            setReleaseScheduledSending(false);
        }).catch(error => {
            toast(error.message, {type: "error"});
            setReleaseScheduledSending(false);
        });
    }
    const sendReleaseDistributed = () => {
        if (!notifyData) return;

        setReleaseDistributedSending(true);

        sendReleaseDistributedEmail({journalists, order: notifyData.order, user: notifyData.user}).then(response => {
            toast("User notified", {type: "success"});
            setReleaseDistributedSending(false);
        }).catch(error => {
            toast(error.message, {type: "error"});
            setReleaseDistributedSending(false);
        });
    }
    const sendNewPressCoverage = () => {
        if (!notifyData) return;

        setNewPressCoverageSending(true);

        sendPressCoverageEmail({order: notifyData.order, user: notifyData.user}).then(response => {
            toast("User notified", {type: "success"});
            setNewPressCoverageSending(false);
        }).catch(error => {
            toast(error.message, {type: "error"});
            setNewPressCoverageSending(false);
        });
    }

    if (loading) {
        return <div className={"page"}>
            <LinearProgress/>
        </div>
    }

    return <div className={styles.wrapper}>
        <Dialog open={notifyDialogOpen} onClose={() => setNotifyDialogOpen(false)}>
            <DialogTitle>Notify {notifyData?.user.name} for order {notifyData?.order.orderNumber}</DialogTitle>

            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <h4>Journalist assigned</h4>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField label={"Journalist name"} value={journalistName}
                                           onChange={e => setJournalistName(e.target.value)}/>
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    variant={"contained"}
                                    color={"primary"}
                                    disableElevation
                                    disabled={journalistAssignedSending || !journalistName}
                                    onClick={sendJournalistAssigned}
                                >
                                    Send
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider/>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <h4>Release scheduled</h4>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField label={"Date"} value={date} onChange={e => setDate(e.target.value)}/>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField label={"Time"} value={time} onChange={e => setTime(e.target.value)}/>
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    variant={"contained"}
                                    color={"primary"}
                                    disableElevation
                                    disabled={releaseScheduledSending || !date || !time}
                                    onClick={sendReleaseScheduled}
                                >
                                    Send
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider/>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <h4>Release distributed</h4>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField label={"Number of journalists"} value={journalists}
                                           onChange={e => setJournalists(e.target.value)}/>
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    variant={"contained"}
                                    color={"primary"}
                                    disableElevation
                                    disabled={releaseDistributedSending || !journalists}
                                    onClick={sendReleaseDistributed}
                                >
                                    Send
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider/>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <h4>New press coverage</h4>
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    variant={"contained"}
                                    color={"primary"}
                                    disableElevation
                                    disabled={newPressCoverageSending}
                                    onClick={sendNewPressCoverage}
                                >
                                    Send
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>

        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell/>
                        <TableCell>Username</TableCell>
                        <TableCell align="right">Email</TableCell>
                        <TableCell align="right">Business</TableCell>
                        <TableCell align="right">Subscriber</TableCell>
                        <TableCell align="right">Name</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user: User) => (
                        <Row key={user.username} user={user} openNotifyDialog={openNotifyDialog}/>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>
}

export default DistributionManagerComponent;
