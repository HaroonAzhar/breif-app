import React from "react";
import styles from "./styles.module.css";

const ForgotPasswordSuccessComponent = () => {
    return <div className={styles.wrapper}>
        <h1>Success!</h1>

        <p>If the account exists you'll receive an email with a reset link soon.</p>
    </div>
}

export default ForgotPasswordSuccessComponent;