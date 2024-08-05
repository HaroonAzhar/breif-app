import React from "react";
import styles from "./styles.module.css";

export default function PrivacyComponent() {
    return <div className={styles.wrapper}>
        <iframe src={"/privacy_policy.html"} scrolling={"no"}>
        </iframe>
    </div>
}
