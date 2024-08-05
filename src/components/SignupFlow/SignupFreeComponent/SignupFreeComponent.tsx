import React, {useContext, useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import UserContext from "../../../Context/UserContext";
import {toast} from "react-toastify";
import {registerNew} from "../../../app/api";
import styles from "../../User/SignupComponent/styles.module.css";
import {Button, Card, CardContent, CardHeader, Grid, Hidden, LinearProgress, TextField} from "@material-ui/core";
import logoBlack from "../../../assets/logo-black.png";
import PlanGroupComponent from "../../PricingComponent/PlanGroupComponent/PlanGroupComponent";
import Cookies from "js-cookie";
import {UserMapper} from "../../../types/user";
import {PackageGroup, PackageGroupMapper} from "../../PricingComponent/types";

const SignupFreeComponent = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [website, setWebsite] = useState("");
    const [business, setBusiness] = useState("");
    const [packages, setPackages] = useState<PackageGroup[]>([]);
    const [loading, setLoading] = useState(false);

    const history = useHistory();

    const {user, setUser} = useContext(UserContext);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_CMS_URL}/package-groups/5`, {
            method: "GET"
        }).then(response => {
            return response.json();
        }).then(data => {
            setPackages([PackageGroupMapper(data)]);
        });
    }, []);

    useEffect(() => {

    }, []);

    if (user) {
        history.push("/");
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
            subscription_level: "free"
        };

        // CMS version

        const response = await registerNew(u, "FREE");
        if (response) {
            Cookies.set("token", response.jwt);

            const user = UserMapper(response.user);

            localStorage.setItem("user", JSON.stringify(user));

            if (response.user) {
                setUser(user);
            }

            toast("Account created!", {type: "success"});
            history.push("/sign-up-free-success");

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
                            Sign up for free to access our tools
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
                            <PlanGroupComponent customHeader={"Your options"} hideButtons packages={packages} selectedBillingCycle />

                            <Button
                                variant={"contained"}
                                color={"primary"}
                                disableElevation
                                onClick={() => history.push("/signup")}
                            >
                                Choose premium
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Hidden>
        </Grid>
    </div>
}

export default SignupFreeComponent;
