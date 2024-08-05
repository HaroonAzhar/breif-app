import React, {useContext, useEffect, useState} from "react";
import styles from "./styles.module.css";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControlLabel,
    Grid,
    Hidden,
    LinearProgress,
    Radio,
    RadioGroup,
    TextField
} from "@material-ui/core";
import logoBlack from "../../../assets/logo-black.png";
import {getCheckoutSessionIdCms, registerNew, updateUserNew} from "../../../app/api";
import {toast} from "react-toastify";
import {Link, useHistory, useParams} from "react-router-dom";
import UserContext from "../../../Context/UserContext";
import {Elements, useStripe} from "@stripe/react-stripe-js";
import Cookies from "js-cookie";
import {UserMapper} from "../../../types/user";
import {PackageGroup, PackageGroupMapper} from "../../PricingComponent/types";
import PlanGroupComponent from "../../PricingComponent/PlanGroupComponent/PlanGroupComponent";
import {loadStripe} from "@stripe/stripe-js";
import stripeConfig from "../../../config/stripe";

const SignupComponent = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [website, setWebsite] = useState("");
    const [business, setBusiness] = useState("");
    const [accountType, setAccountType] = useState("membership");
    const [packages, setPackages] = useState<PackageGroup[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<any>({});

    const stripe = useStripe();

    const history = useHistory();

    const {user} = useContext(UserContext);

    const {code} = useParams();

    

    useEffect(() => {
        const localPackage = localStorage.getItem("selected_package");
        if (!localPackage) {
            history.push("/pricing");
            return;
        }
        const service = JSON.parse(localPackage);
        console.log(service, "package");
        setSelectedPackage(service);
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_CMS_URL}/package-groups/6`, {
            method: "GET"
        }).then(response => {
            return response.json();
        }).then(data => {
            setPackages([PackageGroupMapper(data)]);
        });
    }, []);

    if (user) {
        history.push("/");
    }

    const membershipOnChange = (event: any) => {
        setAccountType(event.target.checked === true ? "membership" : "free");
    }

    const freeOnChange = (event: any) => {
        setAccountType(event.target.checked === true ? "free" : "membership");
    }

    const attemptSignup = async () => {
        if (password !== passwordRepeat) {
            toast("Passwords must match", {type: "error"});
            return;
        }

        setLoading(true);

        const u = {
            email: email,
            company: business,
            website: website,
            name: name,
            username: username,
            password: password,
            subscription_level: selectedPackage.name
        };

        // CMS version
        const response = await registerNew(u);
        if (response) {
            if (accountType === "membership") {
                // Get user JWT
                const jwt = response.jwt;
                Cookies.set("token", jwt);
                const user = UserMapper(response.user);
                Cookies.set("user", user);

                // Get checkout session id
                const checkoutSessionResponse = await getCheckoutSessionIdCms(selectedPackage.stripeId, code);

                // Redirect to checkout
                await stripe?.redirectToCheckout({
                    sessionId: checkoutSessionResponse.id
                });
            } else {
                toast("Account created!", {type: "success"});
                history.push("/signup/success");
            }
        } else {
            setLoading(false);
            toast("Something went wrong. Please try again.", {type: "error"}); // TODO: more accurate error message
        }
    }

    return <div className={styles.wrapper}>
        <Grid container className={styles.loginWrapper}>
            <Grid item xs={12} md={6} xl={8} className={styles.leftSide}>
                <div className={styles.content}>
                    <Grid container>
                        <Grid item xs={12} className={styles.header}>
                            <h3>Join</h3>
                        </Grid>

                        <Grid item xs={12}>
                            <img
                                src={logoBlack}
                                className={styles.logo}
                                alt='logo'
                            />
                        </Grid>

                        <Grid item xs={12}>
                            Create a premium subscription to supercharge your PR.
                        </Grid>

                        <div className={styles.formWrapper}>
                            <div className={styles.inputWrapper}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        variant={"outlined"}
                                        label={"Email"}
                                        type={"text"}
                                        value={email}
                                        required
                                        onChange={(event => setEmail(event.target.value))}/>
                                </Grid>
                            </div>

                            <div className={styles.inputWrapper}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        variant={"outlined"}
                                        label={"Name of business"}
                                        type={"text"}
                                        value={business}
                                        onChange={(event => setBusiness(event.target.value))}/>
                                </Grid>
                            </div>

                            <div className={styles.inputWrapper}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        variant={"outlined"}
                                        label={"Website"}
                                        type={"text"}
                                        value={website}
                                        onChange={(event => setWebsite(event.target.value))}/>
                                </Grid>
                            </div>

                            <div className={styles.inputWrapper}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        variant={"outlined"}
                                        label={"Name"}
                                        type={"text"}
                                        required
                                        value={name}
                                        onChange={(event => setName(event.target.value))}/>
                                </Grid>
                            </div>

                            <div className={styles.inputWrapper}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        variant={"outlined"}
                                        label={"Username"}
                                        type={"text"}
                                        required
                                        value={username}
                                        onChange={(event => setUsername(event.target.value))}/>
                                </Grid>
                            </div>

                            <div className={styles.inputWrapper}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        variant={"outlined"}
                                        label={"Password"}
                                        type={"password"}
                                        required
                                        value={password}
                                        onChange={(event => setPassword(event.target.value))}/>
                                </Grid>
                            </div>

                            <div className={styles.inputWrapper}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        variant={"outlined"}
                                        label={"Repeat password"}
                                        type={"password"}
                                        required
                                        value={passwordRepeat}
                                        onChange={(event => setPasswordRepeat(event.target.value))}/>
                                </Grid>
                            </div>

                            <div className={styles.inputWrapper}>
                                <Grid item xs={12}>
                                    {!loading && <Button
                                        fullWidth
                                        id={"ga-register-button"}
                                        variant={"contained"}
                                        color={"primary"}
                                        onClick={attemptSignup}>
                                        Register
                                    </Button>}

                                    {loading && <div><LinearProgress/></div>}
                                </Grid>
                            </div>

                            <div className={styles.inputWrapper}>
                                <Grid item xs={12}>
                                    <RadioGroup row defaultValue={"membership"}>
                                        {/*<FormControlLabel value={"free"} control={<Radio onChange={freeOnChange}*/}
                                        {/*                                                 checked={accountType === "free"}/>}*/}
                                        {/*                  label={"Free"}/>*/}

                                        <FormControlLabel value={"membership"}
                                                          control={<Radio onChange={membershipOnChange}
                                                                          checked={accountType === "membership"}/>}
                                                          label={`Subscription* / ${selectedPackage.price} ${selectedPackage.cycle}`}/>
                                    </RadioGroup>
                                </Grid>
                            </div>

                            <div className={styles.bottomText}>
                                <Grid item xs={12}>
                                    <p>Already have an account? <Link to={"/login"}>Log in here</Link></p>
                                </Grid>
                            </div>
                        </div>
                    </Grid>
                </div>
            </Grid>

            <Hidden only={["xs", "sm"]}>
                <Grid item xs={12} md={6} xl={4} className={styles.rightSide}>
                    <Card elevation={5}>
                        <CardHeader title={"Subscriptions"}/>
                        <CardContent>
                            <PlanGroupComponent customHeader={"Your options"} hideButtons packages={packages}/>
                        </CardContent>
                    </Card>
                </Grid>
            </Hidden>
        </Grid>
    </div>
}

const SignupComponentWrapper = () => {
    const stripePromise = loadStripe(stripeConfig.testKey);

    return <Elements stripe={stripePromise}>
        <SignupComponent/>
    </Elements>
}

export default SignupComponentWrapper;
