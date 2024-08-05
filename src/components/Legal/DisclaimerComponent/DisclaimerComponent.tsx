import React from "react";
import styles from "./styles.module.css";

export default function DisclaimerComponent() {
    return <div className={styles.wrapper}>
        <iframe src={"/disclaimer.html"} scrolling={"no"}>
        </iframe>
    </div>
}
