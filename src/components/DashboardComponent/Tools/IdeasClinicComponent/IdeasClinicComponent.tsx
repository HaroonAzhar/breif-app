import React, {useContext, useEffect, useState} from "react";
import styles from "./styles.module.css";
import {Button, Grid, TextField} from "@material-ui/core";
import {postIdea} from "../../../../app/api";
import {toast} from "react-toastify";
import UserContext from "../../../../Context/UserContext";
import {useHistory} from "react-router-dom";

const IdeasClinicComponent = () => {
    const [idea, setIdea] = useState("");
    const {user} = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
    }, []);

    if (!user) {
        history.push("/");
    }

    const submitIdea = async () => {
        const res = await postIdea(idea);

        if (res.error) {
            toast(res.error, {type: "error"});
            return;
        }

        if (res.message) {
            toast(res.info, {type: "info"});
        }

        history.push("/dashboard/ideas-clinic/success");
    }

    return <div className={styles.wrapper}>
        <h1>Ideas Clinic</h1>

        <p className={styles.description}>A place to discuss your news and ideas with us helping you continue to
            creation with confidence.
            Let’s discover what aspects of your story are newsworthy</p>

        <Grid container>
            <Grid item xs={12}>
                <div className={styles.textFieldWrapper}>
                    <TextField fullWidth multiline rows={10} variant={"outlined"} label={"Your idea"}
                               onChange={e => setIdea(e.target.value)}/>
                </div>

                <Button variant={"contained"} color={"primary"} onClick={submitIdea}>
                    Submit
                </Button>
            </Grid>

            <Grid item xs={12}>

            </Grid>
        </Grid>
    </div>
};

export default IdeasClinicComponent;
