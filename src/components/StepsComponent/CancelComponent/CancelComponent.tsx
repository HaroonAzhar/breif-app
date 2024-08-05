import React from "react";
import styles from "./styles.module.css";

const CancelComponent = () => {
    return <div className={styles.wrapper}>
        <h1>Order cancelled.</h1>
        <p>If this was a mistake contact support@brief.app</p>
    </div>
}

export default CancelComponent;
