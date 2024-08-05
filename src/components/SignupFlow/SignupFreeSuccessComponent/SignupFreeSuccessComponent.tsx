import React, {useEffect} from "react";
import styles from "../../User/SignupComponent/SignupSuccessComponent/styles.module.css";
import {Button} from "@material-ui/core";
import {useHistory} from "react-router-dom";

const SignupFreeSuccessComponent = () => {
    const history = useHistory();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {

    }, []);

    return <div className={styles.wrapper}>
        <h1>Success</h1>
        <p>Thank you for joining brief.</p>

        <div className={styles.hCenter}>
            <Button variant={"outlined"} color={"primary"} onClick={() => history.push("/dashboard")}>Take me to my
                dash</Button>
        </div>
    </div>
}

export default SignupFreeSuccessComponent;
