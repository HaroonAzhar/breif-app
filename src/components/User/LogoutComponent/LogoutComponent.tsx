import React, {useContext, useEffect} from "react";
import styles from "./styles.module.css";
import Cookies from "js-cookie";
import {toast} from "react-toastify";
import UserContext from "../../../Context/UserContext";
import {Grid} from "@material-ui/core";

const LogoutComponent = () => {
    const {setUser} = useContext(UserContext);

    useEffect(() => {

    }, []);

    useEffect(() => {
        Cookies.remove("token");
        localStorage.removeItem("user");
        toast("Logged out!", {type: "success"});
        setUser(null);
    }, []);

    return (
        <div className={styles.wrapper}>
            <Grid item xs={12}>
                <p className={styles.header}>Logged out!</p>
            </Grid>

            <Grid item xs={12}>
                <p>You have been successfully logged out! See you soon.</p>
            </Grid>
        </div>
    );
}

export default LogoutComponent;
