import React, {useContext} from "react";
import styles from "./styles.module.css";
import classNames from "classnames";
import UserContext from "../../../../Context/UserContext";

// TODO: UPDATE THE IDS HERE BEFORE RELEASE
export function PackageComponent({packageId, onClick}: { packageId: number, onClick: any }) {
    const {user} = useContext(UserContext);

    if (packageId === 4) {
        return <div onClick={onClick} className={classNames(styles.planWrapper, styles.selected)}>
            <div className={styles.planHeader}>
                <span className={styles.planName}>Basic</span>
                <span className={styles.planPrice}>£199</span>
                <span className={styles.planDescription}>Best value</span>
            </div>
            <div className={styles.planDescription}>
                                    <span className={styles.planFeature}>
                                        <b>+ Release Creation</b>
                                    </span>
                <span className={styles.planFeature}>
                                        <b>+ Press Distribution</b>
                                    </span>
                <span className={styles.planFeature}>
                                        <b>+ Account Manager</b>
                                    </span>
            </div>
        </div>
    } else if (packageId === 7) {
        return <div onClick={onClick} className={classNames(styles.planWrapper, styles.selected)}>
            <div className={styles.planHeader}>
                <span className={styles.planName}>Professional</span>
                <span className={styles.planPrice}>£299</span>
                <span className={styles.planDescription}>Everything you'll need...</span>
            </div>
            <div className={styles.planDescription}>
                                    <span className={styles.planFeature}>
                                        <b>Release Creation</b>
                                    </span>
                <span className={styles.planFeature}>
                                        <b>Press Distribution</b>
                                    </span>
                <span className={styles.planFeature}>
                                        <b>Account Manager</b>
                                    </span>
                <span className={styles.planFeature}>
                                        <b>+ Journalist Briefing</b>
                                    </span>
                <span className={styles.planFeature}>
                                        <b>+ Media Relations</b>
                                    </span>
                <span className={styles.planFeature}>
                                        <b>+ Coverage Reports</b>
                                    </span>
                <span className={styles.planFeature}>
                                        <b>+ Status Reports</b>
                                    </span>
            </div>
        </div>
    } else if (packageId === 5) {
        return <div onClick={onClick}
                    className={classNames(styles.planWrapper, styles.selected, !user || !user.subscription ? styles.blurred : "")}>
            {(!user || !user.subscription) && <div className={styles.requiresPremium}>
                Only available to premium users
            </div>}

            <div className={styles.planHeader}>
                <span className={styles.planName}>ESSENTIAL Creation</span>
                <span className={styles.planPrice}>£129</span>
                <span className={styles.planDescription}>Access to the best writers</span>
            </div>
            <div className={styles.planDescription}>
                                    <span className={styles.planFeature}>
                                        <b>Content Creation</b>
                                    </span>
                <span className={styles.planFeature}>
                                        <b>Account Manager</b>
                                    </span>
            </div>
        </div>
    } else if (packageId === 6) {
        return <div onClick={onClick}
                    className={classNames(styles.planWrapper, styles.selected, !user || !user.subscription ? styles.blurred : "")}>
            {(!user || !user.subscription) && <div className={styles.requiresPremium}>
                Only available to premium users
            </div>}


            <div className={styles.planHeader}>
                <span className={styles.planName}>ESSENTIAL Distribution</span>
                <span className={styles.planPrice}>£99</span>
                <span className={styles.planDescription}>Share with the media</span>
            </div>
            <div className={styles.planDescription}>
                                    <span className={styles.planFeature}>
                                        <b>Supply Own Release</b>
                                    </span>
                <span className={styles.planFeature}>
                                        <b>Internal Quality Edit</b>
                                    </span>
                <span className={styles.planFeature}>
                                        <b>Press Distribution</b>
                                    </span>
            </div>
        </div>
    }

    return <div/>
}
