import React, {useContext, useEffect, useState} from "react";
import styles from "./styles.module.css";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Chip,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    Fab,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Tooltip
} from "@material-ui/core";
import UserContext from "../../Context/UserContext";
import {Link, Route, Switch, useHistory} from "react-router-dom";
import {Order, OrderMapper, OrderStatus} from "../../types/order";
import {generateReferral, getMyOrders, getTopPublications, refreshPressCoverage, updateUserNew} from "../../app/api";
import {getOutletStats} from "./helpers";
import classNames from "classnames";
import {DashboardPackageGroup, DashboardPackageGroupMapper} from "./types";
import {
    Add,
    ArrowBackOutlined,
    CalendarTodayOutlined,
    Clear,
    Done,
    EmojiObjects,
    ExitToApp,
    ListOutlined,
    NotificationsActiveOutlined, SearchOutlined,
    Send,
    SentimentSatisfied,
    Settings,
    StorageOutlined,
    TrendingUp,
    VerifiedUser,
    ViewList
} from "@material-ui/icons";
import IdeasClinicComponent from "./Tools/IdeasClinicComponent/IdeasClinicComponent";
import AnalyticsComponent from "./AnalyticComponents/AnalyticsComponent";
import IdeasClinicSuccessComponent from "./Tools/IdeasClinicComponent/Success/IdeasClinicSuccessComponent";
import UpgradeAccountComponent from "./UpgradeAccount/UpgradeAccountComponent";
import SendPressReleaseComponent from "./Tools/SendPressReleaseComponent/SendPressReleaseComponent";
import {toast} from "react-toastify";
import {JournalistsAlertComponent} from "./Tools/JournalistAlertsComponent/JournalistsAlertComponent";
import {PRCalendarComponent} from "./Tools/PRCalendarComponent/PRCalendarComponent";
import {JournalistsDatabaseDialog} from "./JournalistsDatabase/JournalistsDatabaseDialog";
import {OrderListComponent} from "./Tools/OrderListComponent";
import {ViewReleaseComponent} from "./Tools/ViewReleaseComponent";
import {ReleaseSuccessComponent} from "./Tools/ReleaseSuccessComponent";
import {OutletsDatabaseDialog} from "./OutletsDatabaseDialog";
import {Outlet, OutletMapper} from "../../types/outlet";
import {FindJournalistDialog} from "./FIndJournalistDialog";
import { getSubscription } from "../../helper/getSubscription";
import { DisableUnavilableFeatureDialog } from "./FeatureUnavailableDialog";
import { FULL_SERVICE_PRESS_RELEASE, PRO_SERVICES, SEND_A_PRESS_RELEASE } from "../../constants";
import { isFreeElegible, isSendPressReleaseFreeElegible } from "../../helper/freeEligible";
import { PressCoverageUpdateDialog } from "./PressCoverageUpdateDialog";

export default function DashboardComponent() {
    const {user} = useContext(UserContext);
    const [orders, setOrders] = useState([] as Order[]);
    const [completedOrders, setCompletedOrders] = useState([] as Order[]);
    const [liveCampaigns, setLiveCampaigns] = useState([] as Order[]);
    const history = useHistory();
    const [journalistsDatabaseDialogOpen, setJournalistsDatabaseDialogOpen] = useState(false);
    const [outletsDatabaseDialogOpen, setOutletsDatabaseDialogOpen] = useState(false);
    const [pressCovUpdateDialogOpen, setPressCovUpdateDialogOpen] = useState(false);
    const [updatedPressCoverage, setUpdatedPressCoverage] = useState("")

    const [packageGroups, setPackageGroups] = useState<DashboardPackageGroup[]>([]);

    const [findJournalistDialogOpen, setFindJournalistDialogOpen] = useState(false);
    const [subscribeModal, setSubscribeModal] = useState(false);
    const [freeEligibility, setFreeEligibility] = useState(false);
    const [sendPressReleaseFreeEligibility, setSendPressReleaseFreeEligibility] = useState(false);

    const [stats, setStats] = useState({
        delivered: 0,
        opened: 0,
        clicked: 0,
        circulation: 0,
        readership: 0,
        avgMoney: 0,
        seoRanking: 0
    });
    const [outlets, setOutlets] = useState<Outlet[]>([]);

    if (!user) {
        history.push("/");
    }

    const [selectedPackageGroup, setSelectedPackageGroup] = useState<DashboardPackageGroup | null>(null);

    useEffect(() => {

    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_CMS_URL}/dashboard-package-groups`, {
            method: "GET"
        }).then(response => {
            return response.json();
        }).then(data => {
            const temp = data.map((pg: any) => DashboardPackageGroupMapper(pg));
            setPackageGroups(temp);
            setSelectedPackageGroup(temp[0]);
        });

        getTopPublications().then(publications => {
            if (publications && publications.length) {
                setOutlets(publications.map((d: any) => OutletMapper(d)));
            }
        });

        getMyOrders().then(response => {
            const orders = response.map((o: any) => OrderMapper(o))
            setOrders(orders);
            let _fullServicePressReleaseLastOrder = orders.filter((o: any) => o.orderInfo.selectedPackage.name.toUpperCase() === FULL_SERVICE_PRESS_RELEASE.toUpperCase());
            _fullServicePressReleaseLastOrder = _fullServicePressReleaseLastOrder[_fullServicePressReleaseLastOrder.length - 1];
            let _sendPressReleaseLastOrder = orders.filter((o: any) => o.orderInfo.selectedPackage.name.toUpperCase() === SEND_A_PRESS_RELEASE.toUpperCase());
            _sendPressReleaseLastOrder = _sendPressReleaseLastOrder[_sendPressReleaseLastOrder.length - 1];
            setFreeEligibility(isFreeElegible(user?.createdAt, _fullServicePressReleaseLastOrder?.createdAt));
            setSendPressReleaseFreeEligibility(isSendPressReleaseFreeElegible(user?.createdAt, _sendPressReleaseLastOrder?.createdAt));
            setCompletedOrders(orders.filter((order: Order) => order.orderStatus !== OrderStatus.IN_PROGRESS));
            setLiveCampaigns(orders.filter((order: Order) => order.orderStatus === OrderStatus.IN_PROGRESS));

            let opened = 0;
            let delivered = 0;
            let clicked = 0;
            let circulation = 0;
            let readership = 0;
            let avgMoney = 0;
            let seoRanking = 0;

            for (const order of orders) {
                const date = new Date(order.createdAt || "");
                const threshold = new Date("2021-06-07");
                const newAnalytics = date.getTime() > threshold.getTime();

                if (newAnalytics) {
                    delivered += order.delivered;
                    clicked += order.clicked;
                    opened += order.opened;
                } else {
                    order.orderDistributions?.map((d: any) => {
                        delivered += Number(d.delivered);
                        clicked += Number(d.clicked);
                        opened += Number(d.opened);
                    });
                }

            }

            for (const pc of user?.pressCoverage || []) {
                circulation += pc.circulation;
                readership += pc.readership;
                avgMoney += pc.ave;
                seoRanking += pc.seoRanking;
            }

            seoRanking /= orders.length;


            setStats({opened, delivered, clicked, circulation, readership, avgMoney, seoRanking});


            //setOutlets(getOutletStats(orders));
        });
    }, []);
    const isProUser = getSubscription(user?.subscription_level) === "pro";
    const subscriptionHas = (value: string) => {
        if (isProUser && PRO_SERVICES.find(s => s === value)) return true; 
        return false;
    };

    const [sidebarOpen, setSidebarOpen] = useState(window.screen.availWidth > 800);

    const toggleSidebarOpen = () => {
        setSidebarOpen(!sidebarOpen);
    }

    const [referAFriendOpen, setReferAFriendOpen] = useState(false);
    const [friendsEmail, setFriendsEmail] = useState("");

    const [viewMorePublications, setViewMorePublications] = useState(false);

    const handleReferAFriendOnClick = () => {
        setReferAFriendOpen(true);
    }

    const handleReferCompleteOnClick = async () => {
        const response = await generateReferral(friendsEmail);

        if (response) {
            toast("Friend referred!", {type: "success"});
            setReferAFriendOpen(false);
        } else {
            toast("Something went wrong.", {type: "error"});
        }
    }
    const getPrice = (subscriptions: any[], name: string) => {
        try {
            return subscriptions.find((s: any) => s.role === name);
        } catch (e) {
            return null;
        }
    }

    const buyServiceCount = () => {
        return 0;
    }
    const isProandFreePR = (p: any) =>  (isProUser && getPrice(p.subscriptions, "pro") && freeEligibility && p.name.toUpperCase() === FULL_SERVICE_PRESS_RELEASE.toUpperCase());
    const isProAndFreeSendPR = (p: any) => (isProUser && getPrice(p.subscriptions, "pro") && sendPressReleaseFreeEligibility && p.name.toUpperCase() === SEND_A_PRESS_RELEASE.toUpperCase());

    const getPriceOfPackage = (p: any) => {
        try {
            const _userSubscription = user?.subscription_level || '';
            const _subscriptionPrices = p.subscriptions;
            const _priceOfSubscription = getPrice(_subscriptionPrices, _userSubscription?.toLowerCase());

            if (isProAndFreeSendPR(p)) {
                return "£0";
            }
            if (isProandFreePR(p)) {
                return "£0";
            }
            return _priceOfSubscription?.price;
        } catch (e) {
            console.error(e);
            return "";
        }
    }
    const getStripePriceId = (product: any) => {
        const _userSubscription = user?.subscription_level || '';
        const id = product.subscriptions.find((k: any) => k.role === _userSubscription)
        return id.stripeId;
    };

    const updateAllPressCoverage = async () => {
        setPressCovUpdateDialogOpen(true);
        setUpdatedPressCoverage("");
        const response = await refreshPressCoverage();
        if (response) {
            toast("Successfully updated all new Press Coverage", {type: "success"});
            setUpdatedPressCoverage(JSON.stringify(response));
        } else {
            toast("Something went wrong.", {type: "error"});
            setUpdatedPressCoverage("Sorry, Something went wrong");
        }
    }


    const content = <Grid container spacing={5}>
        <Grid item xs={12}>
            <Grid container justify={"flex-start"}>
                <h1>Welcome, {user?.name}</h1>
            </Grid>
        </Grid>

        <Grid item xs={12}>
            <Switch>
                <Route exact path={'/dashboard/order/release-success/:action'}
                       render={() => <ReleaseSuccessComponent/>}/>
                <Route exact path={'/dashboard/order/:orderId/release'}
                       render={() => <ViewReleaseComponent/>}/>
                <Route exact path={'/dashboard/orders/:type'}
                       render={() => <OrderListComponent/>}/>
                <Route exact path={'/dashboard/current-orders'}
                       render={() => <OrderListComponent/>}/>
                <Route exact path='/dashboard/pr-calendar'
                       render={() => <PRCalendarComponent/>}/>
                <Route exact path='/dashboard/ideas-clinic/success'
                       render={() => <IdeasClinicSuccessComponent/>}/>
                <Route exact path='/dashboard/analytics/:orderId'
                       render={() => <AnalyticsComponent/>}/>
                <Route exact path={"/dashboard/results"} render={() => <Grid container>

                    <Grid item xs={12} md={8}>
                        <Grid container spacing={5} style={{width: "100%"}}>
                            <Grid item xs={12}>
                                <Grid container spacing={5}>
                                    <Grid item xs={12}>
                                        <h2 style={{marginBottom: "20px"}}>Lifetime Results</h2>
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

                                    <Grid item xs={12}>
                                        <Card>
                                            <CardHeader title={"Recently contacted publications"}/>
                                            <CardContent >
                                                <Grid item xs={12}>
                                                    <div className={classNames(!user?.subscription && styles.blurred)}>
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>
                                                                        Publications
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        Circulation
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        Online unique users
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        Frequency
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        Media type
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        Sectors
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        Region
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>

                                                            {user?.subscription && outlets.slice(0, viewMorePublications ? outlets.length : 3).map((outlet) =>
                                                                <TableRow>
                                                                    <TableCell>{outlet.name}</TableCell>
                                                                    <TableCell>
                                                                        {outlet.circulation}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {outlet.onlineUniqueUsers}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {outlet.frequency}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {outlet.mediaType}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {outlet.sectors}
                                                                    </TableCell>
                                                                    <TableCell>

                                                                    </TableCell>
                                                                </TableRow>)}
                                                        </Table>

                                                        {!viewMorePublications && <Button onClick={() => setViewMorePublications(true)}>View more</Button>}
                                                        {viewMorePublications && <Button onClick={() => setViewMorePublications(false)}>View less</Button>}
                                                    </div>


                                                    {user?.subscription !== true &&
                                                    <span>To see your top publications upgrade <Link
                                                        to={"upgrade"}>here</Link></span>}
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Card>
                                            <CardHeader title={"Coverage Statistics"}/>
                                            <CardContent>
                                                {stats && <Table
                                                    className={classNames(user?.subscription !== true ? styles.publications : null)}>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell>Total Readership</TableCell>
                                                            <TableCell>{stats.readership?.toLocaleString('en') || 0}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>
                                                                <Tooltip
                                                                    title={"This is calculated by using advertising values to create an estimate editorial value"}
                                                                >
                                                                    <span>Estimated Value</span>
                                                                </Tooltip>
                                                            </TableCell>
                                                            <TableCell>£{stats.avgMoney?.toLocaleString('en') || 0}</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>}

                                                {user?.subscription !== true &&
                                                <span>To see your coverage statistics upgrade <Link
                                                    to={"upgrade"}>here</Link></span>}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <h2>Press coverage</h2>
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container spacing={3} justify={"flex-start"}>
                                    {user?.pressCoverage?.filter(item => item.name !== "rsslink").map(item => <Grid item md={6} xs={12}>
                                        <Card>
                                            <CardHeader
                                                title={item.name}
                                            />

                                            {/* <CardMedia
                                            >
                                                <img className={styles.mediaImg}
                                                     src={process.env.REACT_APP_CMS_URL + (item.thumbnail?.url || "")}/>
                                            </CardMedia> */}

                                            
                                            <CardContent>
                                                <a style={{fontSize: 12}} href={item.url}>{truncate(item.url, 43)}</a>
                                                <br/>
                                                {item.outlet && <div>
                                                    <Table>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell>
                                                                    Reach
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.outlet.onlineUniqueUsers}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    Circulation
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.outlet.circulation}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    SEO Ranking
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.seoRanking ? `${item.seoRanking}/100` : item.outlet.seoRanking ? `${item.outlet.seoRanking}/100` : "N/A"}
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </div>}

                                                {!item.outlet && <div>
                                                    <Table>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell>
                                                                    Reach
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.readership?.toLocaleString('en') || 0}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    SEO Ranking
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.seoRanking ? `${item.seoRanking}%` : "N/A"}
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </div>}


                                            </CardContent>
                                        </Card>
                                    </Grid>)}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <h2>Past results</h2>

                        <div className={"margin-v-md"} style={{marginTop: "50px"}}>
                            {completedOrders.map(order => <div className={"full-width"}>
                                <h5>{order.orderNumber} - {(new Date(order.createdAt)).toLocaleDateString()}</h5>

                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                Journalists Contacted
                                            </TableCell>
                                            <TableCell>
                                                {order.delivered}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>
                                                Emails opened
                                            </TableCell>
                                            <TableCell>
                                                {order.opened}
                                            </TableCell>
                                            <TableCell>
                                                {Math.round((order.opened / order.delivered) * 10) / 10}%
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>
                                                Links clicked
                                            </TableCell>
                                            <TableCell>
                                                {order.clicked}
                                            </TableCell>
                                            <TableCell>
                                                {Math.round((order.clicked / order.delivered) * 10) / 10}%
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>)}
                        </div>
                    </Grid>
                </Grid>}/>

                <Route exact path={"/dashboard/upgrade"} render={() => <Grid container>
                    <Grid item xs={12}>
                        <UpgradeAccountComponent/>
                    </Grid>

                </Grid>}/>

                <Route exact path={"/dashboard/ideas-clinic"} render={() => <IdeasClinicComponent/>}/>

                <Route exact path={"/dashboard/send-press-release"} render={() => <Grid container>
                    <Grid item xs={12}>
                        <SendPressReleaseComponent/>
                    </Grid>

                </Grid>}/>

                <Route exact path={"/dashboard/journalist-alerts"} render={() => <Grid container>
                    <Grid item xs={12}>
                        <JournalistsAlertComponent/>
                    </Grid>
                </Grid>}/>

                <Route path={"/dashboard"} render={() => <Grid container spacing={5}>
                    <Grid item xs={12} lg={4}>
                        <Card>
                            <List>
                                {packageGroups.map(packageGroup => <ListItem
                                    selected={selectedPackageGroup === packageGroup} button
                                    onClick={() => setSelectedPackageGroup(packageGroup)}>
                                    <ListItemText primary={packageGroup.title}/>
                                </ListItem>)}
                            </List>
                        </Card>
                    </Grid>

                    <Grid item xs={12} lg={8}>
                        <Grid container spacing={3}>
                            {selectedPackageGroup?.packages.map(p => <Grid item xs={12} md={6}>
                                <Card>
                                    <CardHeader
                                        title={p.name}
                                        subheader={p.subtitle}
                                        action={
                                            <Fab
                                                color={"primary"}
                                            >
                                                {getPriceOfPackage(p)}
                                            </Fab>
                                        }
                                    />

                                    <CardContent>
                                        <List>
                                            {p.features.map(feature => <Tooltip title={feature.tooltip}
                                                                                enterTouchDelay={0}
                                                                                leaveTouchDelay={3000}>
                                                <ListItem
                                                    style={(!feature.has && !subscriptionHas(feature.text)) ? {color: 'lightgray'} : {}}>
                                                    <ListItemIcon>
                                                        {(feature.has || subscriptionHas(feature.text)) ? <Done/> : <Clear/>}
                                                    </ListItemIcon>
                                                    <ListItemText>{feature.text}</ListItemText>
                                                </ListItem>
                                            </Tooltip>)}
                                        </List>

                                        {selectedPackageGroup?.requiresPremium && !user?.subscription && <div>
                                            Only available to premium users
                                        </div>}
                                    </CardContent>

                                    <CardActions>
                                        <Button fullWidth variant={"contained"} color={"primary"}
                                                disabled={selectedPackageGroup?.requiresPremium && !user?.subscription}
                                                onClick={() => {
                                                    localStorage.setItem("selected_product", JSON.stringify({...p, price: getPriceOfPackage(p), stripeId: getStripePriceId(p) }));
                                                    localStorage.setItem("selected_package", String(p.id));
                                                    history.push(p.redirectPath);
                                                }}>Choose</Button>
                                    </CardActions>
                                </Card>
                            </Grid>)}
                        </Grid>
                    </Grid>
                </Grid>}/>
            </Switch>
        </Grid>
    </Grid>

    return <div className={styles.layoutWrapper}>
        <Dialog open={referAFriendOpen} onClose={() => setReferAFriendOpen(false)}>
            <DialogTitle>
                Refer a friend
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        Both of you will receive a 10% off coupon code for any package once they sign up as a
                        subscriber.
                    </Grid>

                    <Grid item xs={12}>
                        <TextField type={"email"} fullWidth placeholder={"Email address"} value={friendsEmail}
                                   onChange={e => setFriendsEmail(e.target.value)}/>
                    </Grid>

                    <Grid item xs={12}>
                        <Button disabled={!friendsEmail} fullWidth variant={"contained"} color={"primary"}
                                onClick={handleReferCompleteOnClick}>Refer</Button>
                    </Grid>
                </Grid>

            </DialogContent>
        </Dialog>

        <div className={styles.openSidebarButton}>
            <IconButton onClick={toggleSidebarOpen}>
                <ListOutlined/>
            </IconButton>
        </div>

        <div className={classNames(styles.layoutSidebar, !sidebarOpen && styles.layoutSidebarHidden)}>
            <div className={styles.layoutSidebarInner}>
                <div className={styles.layoutSidebarInnerContent}>
                    <IconButton onClick={() => setSidebarOpen(false)}>
                        <ArrowBackOutlined/>
                    </IconButton>

                    {!user?.subscription && <Container>
                        <div className={classNames(!sidebarOpen && styles.buttonHidden)}>
                            <Button
                                color={"primary"}
                                variant={"outlined"}
                                style={{marginTop: "50px"}}
                                onClick={() => history.push({pathname: "/contact-us", state: "To upgrade or downgrade your subscription please send us your query by using the form below."})}
                            >
                                Upgrade to premium
                            </Button>
                        </div>
                    </Container>}

                    <List subheader={
                        <ListSubheader style={{color: "white"}}>Navigation</ListSubheader>
                    }>
                        {user?.subscription && <ListItem>
                            <Chip icon={<VerifiedUser/>} variant={"outlined"} color={"primary"}
                                  label={"Premium account"}/>
                        </ListItem>}

                        <ListItem button onClick={() => history.push("/dashboard/start-new")}>
                            <ListItemIcon>
                                <Add/>
                            </ListItemIcon>
                            {sidebarOpen && <ListItemText primary={"Start new"}/>}
                        </ListItem>

                        <ListItem button onClick={() => history.push("/dashboard/orders/current")}>
                            <ListItemIcon>
                                <ListOutlined/>
                            </ListItemIcon>
                            {sidebarOpen && <ListItemText primary={"Current orders"}/>}
                        </ListItem>

                        <ListItem button onClick={() => history.push("/dashboard/orders/past")}>
                            <ListItemIcon>
                                <ListOutlined/>
                            </ListItemIcon>
                            {sidebarOpen && <ListItemText primary={"Past orders"}/>}
                        </ListItem>

                        <ListItem button onClick={() => history.push("/dashboard/results")}>
                            <ListItemIcon>
                                <TrendingUp/>
                            </ListItemIcon>
                            {sidebarOpen && <ListItemText primary={"Results"}/>}
                        </ListItem>

                        <ListItem button onClick={() => history.push("/dashboard/ideas-clinic")}>
                            <ListItemIcon>
                                <EmojiObjects/>
                            </ListItemIcon>
                            {sidebarOpen && <ListItemText primary={"Ideas clinic"}/>}
                        </ListItem>

                        <ListItem button onClick={() => history.push("/dashboard/send-press-release")}>
                            <ListItemIcon>
                                <Send/>
                            </ListItemIcon>


                            {sidebarOpen && <ListItemText primary={"Press release analysis"}/>}
                        </ListItem>

                        <ListItem button onClick={() => history.push("/dashboard/journalist-alerts")}>
                            <ListItemIcon>
                                <NotificationsActiveOutlined/>
                            </ListItemIcon>


                            {sidebarOpen && <ListItemText primary={"Journalist alerts"}/>}

                        </ListItem>

                        <ListItem button onClick={() => history.push("/dashboard/pr-calendar")}>
                            <ListItemIcon>
                                <CalendarTodayOutlined/>
                            </ListItemIcon>

                            {sidebarOpen && <ListItemText primary={"PR Calendar"}/>}
                        </ListItem>

                        <ListItem style={{ opacity: !isProUser ? 0.3 : 1 }} button onClick={() => isProUser ? setFindJournalistDialogOpen(true) : setSubscribeModal(true)}>
                            <ListItemIcon>
                                <SearchOutlined/>
                            </ListItemIcon>

                            {sidebarOpen && <ListItemText primary={"Find a journalist"}/>}
                        </ListItem>
                    </List>

                    {user?.admin && <List subheader={
                        <ListSubheader style={{color: "white"}}>Admin</ListSubheader>
                    }>
                        <ListItem button onClick={() => history.push("/admin/distributions")}>
                            <ListItemIcon>
                                <ViewList/>
                            </ListItemIcon>
                            {sidebarOpen && <ListItemText primary={"User distributions"}/>}
                        </ListItem>

                        <ListItem button onClick={() => setJournalistsDatabaseDialogOpen(true)}>
                            <ListItemIcon>
                                <StorageOutlined/>
                            </ListItemIcon>
                            {sidebarOpen && <ListItemText primary={"Import journalists"}/>}
                        </ListItem>

                        <ListItem button onClick={() => setOutletsDatabaseDialogOpen(true)}>
                            <ListItemIcon>
                                <StorageOutlined/>
                            </ListItemIcon>
                            {sidebarOpen && <ListItemText primary={"Import outlets"}/>}
                        </ListItem>

                        <ListItem button onClick={() => history.push("/admin/sendPressRelease")}>
                            <ListItemIcon>
                                <StorageOutlined/>
                            </ListItemIcon>
                            {sidebarOpen && <ListItemText primary={"Send press release"}/>}
                        </ListItem>

                        <ListItem button onClick={updateAllPressCoverage}>
                            <ListItemIcon>
                                <StorageOutlined/>
                            </ListItemIcon>
                            {sidebarOpen && <ListItemText primary={"Update all Press Coverage"}/>}
                        </ListItem>
                    </List>}

                    <List subheader={
                        <ListSubheader style={{color: "white"}}>Account</ListSubheader>
                    }>
                        <ListItem button onClick={handleReferAFriendOnClick}>
                            <ListItemIcon>
                                <SentimentSatisfied/>
                            </ListItemIcon>
                            {sidebarOpen && <ListItemText primary={"Refer a friend"}/>}
                        </ListItem>

                        <ListItem button onClick={() => history.push("/account")}>
                            <ListItemIcon>
                                <Settings/>
                            </ListItemIcon>
                            {sidebarOpen && <ListItemText primary={"Settings"}/>}
                        </ListItem>

                        <ListItem button onClick={() => history.push("/logout")}>
                            <ListItemIcon>
                                <ExitToApp/>
                            </ListItemIcon>
                            {sidebarOpen && <ListItemText primary={"Logout"}/>}
                        </ListItem>
                    </List>
                </div>
            </div>
        </div>

        <div className={styles.layoutContent}>
            {content}
        </div>

        <PressCoverageUpdateDialog data={updatedPressCoverage} open={pressCovUpdateDialogOpen} setOpen={setPressCovUpdateDialogOpen}/>
        <JournalistsDatabaseDialog open={journalistsDatabaseDialogOpen} setOpen={setJournalistsDatabaseDialogOpen}/>
        <OutletsDatabaseDialog open={outletsDatabaseDialogOpen} setOpen={setOutletsDatabaseDialogOpen}/>
        <FindJournalistDialog open={findJournalistDialogOpen} setOpen={setFindJournalistDialogOpen}/>
        <DisableUnavilableFeatureDialog open={subscribeModal} setOpen={setSubscribeModal}/>
    </div>
}

function truncate(str: string, n: number){
    return (str.length > n) ? str.substr(0, n-1) + '...' : str;
}
