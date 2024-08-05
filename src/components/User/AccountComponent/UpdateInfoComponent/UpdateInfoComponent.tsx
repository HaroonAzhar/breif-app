import React, {useContext, useEffect, useState} from "react";
import styles from "./styles.module.css";
import {updateUserNew} from "../../../../app/api";
import {toast} from "react-toastify";
import {User} from "../../../../types/user";
import {Button, Grid, TextField} from "@material-ui/core";
import UserContext from "../../../../Context/UserContext";

const UpdateInfoComponent = () => {
    const {user, setUser} = useContext(UserContext);

    const [name, setName] = useState(user?.name || "");
    const [website, setWebsite] = useState(user?.website || "");
    const [business, setBusiness] = useState(user?.business || "");

    useEffect(() => {
    }, [])

    const attemptUpdate = () => {
        updateUserNew({name: name, website: website, company: business}).then(res => {
            if (res.error) {
                toast(res.error, {type: "error"});
            } else {
                let temp: User = {
                    id: user?.id || -1,
                    business: business,
                    email: user?.email,
                    name: name,
                    username: user?.username || "",
                    website: website,
                    pressCoverage: user?.pressCoverage || [],
                    createdAt: user?.createdAt || ""
                }

                setUser(temp);

                toast("Success", {type: "success"});
            }
        });
    }

    return <div className={styles.wrapper}>
        <h3>Your info</h3>

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
                <Button
                    fullWidth
                    variant={"contained"}
                    color={"primary"}
                    onClick={attemptUpdate}
                >
                    Update
                </Button>
            </Grid>
        </div>
    </div>
}

export default UpdateInfoComponent;
