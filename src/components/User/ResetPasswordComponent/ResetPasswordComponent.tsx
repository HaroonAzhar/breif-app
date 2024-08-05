import React, {useContext, useEffect, useState} from "react";
import styles from "./styles.module.css";
import {Button, Grid, Hidden, TextField} from "@material-ui/core";
import logoBlack from "../../../assets/logo-black.png";
import {useHistory} from "react-router-dom";
import UserContext from "../../../Context/UserContext";
import {resetPassword} from "../../../app/api";
import {toast} from "react-toastify";
import * as queryString from "querystring";

const ResetPasswordComponent = (props: any) => {
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const history = useHistory();

    const {user} = useContext(UserContext);

    const code = queryString.parse(props.location.search)["?code"] as string;


    useEffect(() => {

    }, []);

    if (user) {
        history.push("/");
    }

    const attemptReset = async () => {
        const response = await resetPassword(code, password);

        if (response) {
            history.push("/reset-password/success");
        } else {
            toast("Something went wrong. Please try again.", {type: "error"});
        }
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

                        <Grid item xs={12}>
                            <h3>Reset password</h3>
                        </Grid>

                        <div className={styles.formWrapper}>
                            <div className={styles.inputWrapper}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        variant={"outlined"}
                                        label={"New password"}
                                        type={"password"}
                                        value={password}
                                        onChange={(event => setPassword(event.target.value))}/>
                                </Grid>
                            </div>

                            <div className={styles.inputWrapper}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        variant={"outlined"}
                                        label={"Repeat new password"}
                                        type={"password"}
                                        value={passwordRepeat}
                                        onChange={(event => setPasswordRepeat(event.target.value))}/>
                                </Grid>
                            </div>

                            <div className={styles.inputWrapper}>
                                <Grid item xs={12}>
                                    <Button
                                        fullWidth
                                        variant={"contained"}
                                        color={"primary"}
                                        onClick={attemptReset}
                                        disabled={password !== passwordRepeat || password === ""}
                                    >
                                        Confirm
                                    </Button>
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

export default ResetPasswordComponent;
