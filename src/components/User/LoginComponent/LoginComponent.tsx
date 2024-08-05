import React, {useContext, useEffect, useState} from "react";
import styles from "./styles.module.css";
import {Button, Grid, Hidden, TextField} from "@material-ui/core";
import logoBlack from "../../../assets/logo-black.png";
import {cmsLogin} from "../../../app/api";
import {toast} from "react-toastify";
import {Link, useHistory} from "react-router-dom";
import UserContext from "../../../Context/UserContext";
import Cookies from "js-cookie";
import {UserMapper} from "../../../types/user";

const LoginComponent = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();

    const {user, setUser} = useContext(UserContext);

    useEffect(() => {

    }, []);

    if (user) {
        history.push("/");
    }

    const attemptLogin = () => {
        cmsLogin(username, password).then(res => {
            if (!res) {
                toast("Something went wrong. Please try again.", {type: "error"});
            } else {
                toast("Logged in!", {type: "success"});
                Cookies.set("token", res.jwt);

                const user = UserMapper(res.user);

                localStorage.setItem("user", JSON.stringify(user));

                if (res.user) {
                    setUser(user);
                }
                history.push("/");
            }
        });
    }

    return <div className={styles.wrapper}>
        <Grid container className={styles.loginWrapper}>
            <Grid item xs={12} md={8} className={styles.leftSide}>
                <div className={styles.content}>
                    <Grid container>
                        <Grid item xs={12} className={styles.header}>
                            <h3>Welcome to</h3>
                        </Grid>

                        <Grid item xs={12}>
                            <img
                                src={logoBlack}
                                className={styles.logo}
                                alt='logo'
                            />
                        </Grid>


                        <div className={styles.formWrapper}>
                            <div className={styles.inputWrapper}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        variant={"outlined"}
                                        label={"Username"}
                                        type={"text"}
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
                                        value={password}
                                        onChange={(event => setPassword(event.target.value))}/>
                                </Grid>
                            </div>

                            <div className={styles.inputWrapper}>
                                <Grid item xs={12}>
                                    <Button
                                        fullWidth
                                        variant={"contained"}
                                        color={"primary"}
                                        id={"ga-login-button"}
                                        onClick={attemptLogin}>
                                        Login
                                    </Button>
                                </Grid>
                            </div>

                            <div className={styles.bottomText}>
                                <Grid item xs={12}>
                                    <p>Don't have an account? <Link to={"/signup"}>Sign Up Now</Link></p>
                                    <p>Forgot your password? Reset it <Link to={"/forgot-password"}>here</Link></p>
                                </Grid>
                            </div>
                        </div>
                    </Grid>
                </div>
            </Grid>

            <Hidden only={["xs", "sm"]}>
                <Grid item xs={12} md={4} className={styles.rightSide}>

                </Grid>
            </Hidden>
        </Grid>
    </div>
}

export default LoginComponent;
