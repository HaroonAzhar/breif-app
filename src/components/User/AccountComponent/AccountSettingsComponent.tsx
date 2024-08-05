import React, {useContext, useEffect, useState} from "react";
import styles from "./styles.module.css";
import UserContext from "../../../Context/UserContext";
import {useHistory} from "react-router-dom";
import {Button, Grid} from "@material-ui/core";
import {getBillingUrlCms, getCheckoutSessionIdCms} from "../../../app/api";
import ChangePasswordComponent from "./ChangePasswordComponent/ChangePasswordComponent";
import UpdateInfoComponent from "./UpdateInfoComponent/UpdateInfoComponent";
import {Elements, useStripe} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import stripeConfig from "../../../config/stripe";

const AccountSettingsComponent = () => {
    const {user} = useContext(UserContext);
    const history = useHistory();
    const [billingUrl, setBillingUrl] = useState("");
    const stripe = useStripe();



    const upgradeOnClick = async () => {
        if (user?.username) {
            const response = await getCheckoutSessionIdCms('');
            const id = response.id;

            if (id) {
                await stripe?.redirectToCheckout({
                    sessionId: id
                });
            }
        }
    }

    useEffect(() => {
        if (!user) {
            history.push("/");
        }

        getBillingUrlCms().then(url => {
            setBillingUrl(url.url);
        })
    }, [user, history])

    return  <div className={styles.wrapper}>
            <h1>Account settings</h1>

            <div className={styles.content}>
                <Grid container alignItems={"center"} spacing={4}>
                    <Grid item xs={12} md={6}>
                        <UpdateInfoComponent/>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <ChangePasswordComponent/>
                    </Grid>

                    <Grid item xs={12}>
                        <h3>Your subscription</h3>

                        {(user?.subscription === false || !user?.subscription) &&
                        <Button onClick={upgradeOnClick} color={"primary"} variant={"contained"}>Upgrade</Button>}
                        {user?.subscription === true && <a href={billingUrl}>
                            Billing
                        </a>}<br />
                        To upgrade or downgrade your subscription please email us at <a href="mailto:sales@brief.app">sales@brief.app</a>.
                    </Grid>
                </Grid>
            </div>
        </div>
}

const AccountSettingsComponentWrapper = () => {
    const stripePromise = loadStripe(stripeConfig.testKey);

    return <Elements stripe={stripePromise}>
        <AccountSettingsComponent />
    </Elements>
}

export default AccountSettingsComponentWrapper;
