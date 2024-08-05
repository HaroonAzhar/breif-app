import React, {useContext, useEffect, useState} from "react";
import {Package, PackageMapper} from "../../PricingComponent/types";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip
} from "@material-ui/core";
import {Clear, Done} from "@material-ui/icons";
import {getCheckoutSessionIdCms} from "../../../app/api";
import {Elements, useStripe} from "@stripe/react-stripe-js";
import UserContext from "../../../Context/UserContext";
import {loadStripe} from "@stripe/stripe-js";
import stripeConfig from "../../../config/stripe";

const UpgradeAccountComponent = () => {
    const {user} = useContext(UserContext);
    const [premiumPackage, setPremiumPackage] = useState<Package | null>(null);

    const stripe = useStripe();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_CMS_URL}/packages/9`, {
            method: "GET"
        }).then(response => {
            return response.json();
        }).then(data => {
            setPremiumPackage(PackageMapper(data));
        });
    }, []);

    const upgradeAccount = async () => {
        if (user) {
            const response = await getCheckoutSessionIdCms('');
            const id = response.id;

            if (id) {
                await stripe?.redirectToCheckout({
                    sessionId: id
                });
            }
        }
    }


    return <div>
        <Grid item xs={12} md={6}>
            {premiumPackage && <Card>
                <CardHeader
                    title={premiumPackage.name}
                    subheader={premiumPackage.subtitle}
                />

                <CardContent>
                    <List>
                        {premiumPackage.features.map(feature => <Tooltip title={feature.tooltip}
                                                                         enterTouchDelay={0}
                                                                         leaveTouchDelay={3000}>
                            <ListItem style={!feature.has ? {color: 'lightgray'} : {}}>
                                <ListItemIcon>
                                    {feature.has ? <Done/> : <Clear/>}
                                </ListItemIcon>
                                <ListItemText>{feature.text}</ListItemText>
                            </ListItem>
                        </Tooltip>)}
                    </List>
                </CardContent>

                <CardActions>
                    <Button fullWidth variant={"contained"} color={"primary"}
                            onClick={upgradeAccount}>Upgrade</Button>
                </CardActions>
            </Card>}

        </Grid>
    </div>
}

const UpgradeAccountWrapper = () => {
    const stripePromise = loadStripe(stripeConfig.testKey);

    return <Elements stripe={stripePromise}>
        <UpgradeAccountComponent/>
    </Elements>
}

export default UpgradeAccountWrapper;
