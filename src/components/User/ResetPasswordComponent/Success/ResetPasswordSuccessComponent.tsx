import React, {useEffect} from "react";
import styles from "./styles.module.css";

const ResetPasswordSuccessComponent = () => {
    useEffect(() => {
    }, []);

    return <div className={styles.wrapper}>
        <h1>Success!</h1>

        <p>Your password has been changed.</p>
    </div>
}

export default ResetPasswordSuccessComponent;
