import React, {useEffect, useState} from "react";
import styles from "./styles.module.css";
import {Button, Grid, TextField} from "@material-ui/core";
import {updateUserNew} from "../../../../app/api";
import {toast} from "react-toastify";

const ChangePasswordComponent = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordRepeat, setNewPasswordRepeat] = useState("");

    useEffect(() => {
    }, []);

    const attemptPasswordChange = () => {
        updateUserNew({password: newPassword}).then(res => {
            if (res.error) {
                toast(res.error, {type: "error"});
            } else {
                toast("Success", {type: "success"});
            }
        });
    }

    return <div className={styles.wrapper}>
        <h3>Change password</h3>
        <div className={styles.inputWrapper}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    variant={"outlined"}
                    label={"Current password"}
                    type={"password"}
                    value={currentPassword}
                    onChange={(event => setCurrentPassword(event.target.value))}/>
            </Grid>
        </div>

        <div className={styles.inputWrapper}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    variant={"outlined"}
                    label={"New password"}
                    type={"password"}
                    value={newPassword}
                    onChange={(event => setNewPassword(event.target.value))}/>
            </Grid>
        </div>

        <div className={styles.inputWrapper}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    variant={"outlined"}
                    label={"Repeat new password"}
                    type={"password"}
                    value={newPasswordRepeat}
                    onChange={(event => setNewPasswordRepeat(event.target.value))}/>
            </Grid>
        </div>

        <div className={styles.inputWrapper}>
            <Grid item xs={12}>
                <Button onClick={attemptPasswordChange} variant="contained" color="primary" fullWidth
                        disabled={currentPassword === "" || newPassword === "" || newPasswordRepeat === "" || newPassword !== newPasswordRepeat}>
                    Change
                </Button>
            </Grid>
        </div>
    </div>
}

export default ChangePasswordComponent;
