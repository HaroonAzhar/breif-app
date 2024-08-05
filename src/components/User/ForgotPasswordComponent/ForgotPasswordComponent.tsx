import React, {useContext, useEffect, useState} from "react";
import styles from "./styles.module.css";
import {Button, Grid, Hidden, TextField} from "@material-ui/core";
import logoBlack from "../../../assets/logo-black.png";
import {forgotPassword} from "../../../app/api";
import {useHistory} from "react-router-dom";
import UserContext from "../../../Context/UserContext";
import {toast} from "react-toastify";

const ForgotPasswordComponent = () => {
    const [email, setEmail] = useState("");
    const history = useHistory();

    const {user} = useContext(UserContext);

    useEffect(() => {

    }, []);

    if (user) {
        history.push("/");
    }

    const attemptReset = async () => {
        const response = await forgotPassword(email);

        if (response) {
            history.push("/forgot-password/success");
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
                            <h3>Forgot Password</h3>
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
                                        onChange={(event => setEmail(event.target.value))}/>
                                </Grid>
                            </div>

                            <div className={styles.inputWrapper}>
                                <Grid item xs={12}>
                                    <Button
                                        fullWidth
                                        variant={"contained"}
                                        color={"primary"}
                                        onClick={attemptReset}
                                        disabled={email === ""}>
                                        Continue
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

export default ForgotPasswordComponent;
