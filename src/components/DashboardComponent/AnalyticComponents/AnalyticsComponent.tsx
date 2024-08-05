import React, {useContext, useEffect, useState} from "react";
import styles from "./styles.module.css";
import {Link, useHistory, useParams} from "react-router-dom";
import {getMyOrder} from "../../../app/api";
import {Order, OrderMapper} from "../../../types/order";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableRow
} from "@material-ui/core";
import UserContext from "../../../Context/UserContext";
import {countStats, getOutlets} from "../helpers";
import classNames from "classnames";
import {InfoOutlined} from "@material-ui/icons";
import {Converter} from "showdown";
import {getUniqueAttributes} from "../Tools/ViewReleaseComponent";

const AnalyticsComponent = () => {
    const {orderId} = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [stats, setStats] = useState<{ delivered: number, opened: number, clicked: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [outlets, setOutlets] = useState<{ name: string, clicked: number, opened: number }[]>([]);
    const [viewAllClicked, setViewAllClicked] = useState(false);
    const [viewAllOpened, setViewAllOpened] = useState(false);
    const history = useHistory();

    // const newAnalytics = order?.orderDistributions?.length || 0 > 0;
    const newAnalytics = true;

    const [releaseURL, setReleaseURL] = useState("");

    const {user} = useContext(UserContext);

    if (!user) {
        history.push("/");
    }

    useEffect(() => {
        if (order?.release) {
            fetch(process.env.REACT_APP_CMS_URL + order.release.url).then(response => {
                return response.blob();
            }).then(blob => {
                const url = URL.createObjectURL(blob);
                setReleaseURL(url);
            }).catch(error => {
                console.log(error);
            })
        }
    }, [order]);

    const publications = getUniqueAttributes(order?.audience || [], "outlet");

    useEffect(() => {
        setLoading(true);
        getMyOrder(orderId).then(response => {
            const o = OrderMapper(response);

            setOutlets(getOutlets(o));

            const newAnalytics = order?.orderDistributions?.length || 0 > 0;

            console.log(o)

            if (newAnalytics) {
                setStats({clicked: o.clicked || 0, delivered: o.delivered || 0, opened: o.opened || 0});
            } else {
                const _stats = countStats(o);
                _stats.clicked += o.clicked;
                _stats.delivered += o.delivered;
                _stats.opened += o.opened;
                setStats(_stats);
            }

            setOrder(o);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
        });

    }, [orderId]);

    const renderLoading = () => {
        return <div className={styles.loading}>
            <CircularProgress/>
        </div>
    }

    const renderAnalytics = () => {
        return <div className={styles.content}>
            <Grid container spacing={5}>
                <Grid item xs={12}>
                    <div className={"info-box"}>
                        <InfoOutlined/>
                        Scroll down to see your press release.
                    </div>
                </Grid>

                <h1>Analytics for {order?.orderNumber}</h1>

                <Grid item xs={12}>
                    <Card>
                        <CardHeader title={"Distribution Analytics"}/>
                        <CardContent>
                            {stats && <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Journalists Contacted</TableCell>
                                        <TableCell>{Number(stats.delivered || 0)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Emails Opened</TableCell>
                                        <TableCell>{Number(stats.opened)}</TableCell>
                                        <TableCell>{(stats.opened / stats.delivered * 100).toFixed(1)}%</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Links Clicked</TableCell>
                                        <TableCell>{stats.clicked}</TableCell>
                                        <TableCell>{(stats.clicked / stats.delivered * 100).toFixed(1)}%</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>}
                        </CardContent>
                    </Card>
                </Grid>

                {!newAnalytics && <Grid item xs={12}>
                    <Card>
                        <CardHeader title={"Publications Who Clicked"}/>
                        <CardContent>
                            <Table className={classNames(user?.subscription !== true && styles.blur)}>
                                <TableBody>
                                    {outlets
                                        .filter(o => o.clicked > 0)
                                        .sort((a, b) => b.clicked - a.clicked)
                                        .slice(0, viewAllClicked ? undefined : 5)
                                        .map((outlet, index) => <TableRow key={index}>
                                            <TableCell>{outlet.name}</TableCell>
                                            <TableCell>{outlet.clicked}</TableCell>
                                        </TableRow>)}

                                    <Button
                                        onClick={() => setViewAllClicked(!viewAllClicked)}>{viewAllClicked ? "Hide" : "View all"}</Button>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>}

                {!newAnalytics && <Grid item xs={12}>
                    <Card>
                        <CardHeader title={"Publications who opened"}/>
                        <CardContent>
                            <Table className={classNames(user?.subscription !== true && styles.blur)}>
                                <TableBody>
                                    {outlets
                                        .filter(o => o.opened > 0)
                                        .sort((a, b) => b.opened - a.opened)
                                        .slice(0, viewAllOpened ? undefined : 5)
                                        .map((outlet, index) => <TableRow key={index}>
                                            <TableCell>{outlet.name}</TableCell>
                                            <TableCell>{outlet.opened}</TableCell>
                                        </TableRow>)}

                                    <Button
                                        onClick={() => setViewAllOpened(!viewAllOpened)}>{viewAllOpened ? "Hide" : "View all"}</Button>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>}

                {newAnalytics && order && <Grid item xs={12}>
                    <Card>
                        <CardHeader title={"Publications"}/>
                        <CardContent>
                            <Table className={classNames(user?.subscription !== true && styles.blur)}>
                                <TableBody>
                                    {publications.splice(0, viewAllOpened ? publications.length : 5).map((outlet, index) =>
                                        <TableRow
                                            key={index}>
                                            <TableCell>{outlet}</TableCell>
                                        </TableRow>)}

                                    <Button
                                        onClick={() => setViewAllOpened(!viewAllOpened)}>{viewAllOpened ? "Hide" : "View all"}</Button>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>}


                {user?.subscription !== true &&
                <span>To view publication data upgrade <Link to={"account/settings"}>here</Link></span>}

                <hr/>

                {order?.releaseRT && <Grid item xs={12}>
                    <h4>Your release</h4>
                    <h5>Here's what was sent out.</h5>

                    <pre className={'pre'}
                         dangerouslySetInnerHTML={{__html: (new Converter()).makeHtml(order?.releaseRT)}}/>
                </Grid>}
            </Grid>
        </div>
    }

    return <div className={styles.wrapper}>
        {loading && renderLoading()}

        {!loading && renderAnalytics()}
    </div>
}

export default AnalyticsComponent;
