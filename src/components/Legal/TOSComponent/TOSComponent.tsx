import React from "react";
import styles from "./styles.module.css";

export default function TOSComponent() {
    return <div className={styles.wrapper}>
        <iframe src={"/TOS.html"} scrolling={"no"}>
        </iframe>
    </div>
}
