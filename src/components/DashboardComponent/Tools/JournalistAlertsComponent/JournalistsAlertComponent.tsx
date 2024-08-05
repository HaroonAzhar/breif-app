import React, {useContext, useEffect, useState} from "react";
import {getJournalistAlerts} from "../../../../app/api";
import {JournalistAlert, JournalistAlertMapper} from "../../../../types/journalist-alerts";
import {JournalistAlertComponent} from "./JournalistAlertComponent";
import {Grid} from "@material-ui/core";
import UserContext from "../../../../Context/UserContext";

export const JournalistsAlertComponent = () => {
    const [todaysAlerts, setTodaysAlerts] = useState<JournalistAlert[]>([]);
    const [recentAlerts, setRecentAlerts] = useState<JournalistAlert[]>([]);

    const {user} = useContext(UserContext);


    useEffect(() => {
        const today = new Date();

        getJournalistAlerts().then(data => {
            let _alerts: JournalistAlert[] = data.map((d: any) => JournalistAlertMapper(d)).filter((a: JournalistAlert) => a.approved);

            _alerts = _alerts.sort((a, b) => {
                return b.fetchedAt.getTime() - a.fetchedAt.getTime();
            });

            setTodaysAlerts(_alerts.filter(a => a.fetchedAt.getDate() === today.getDate()));
            setRecentAlerts(_alerts.filter(a => a.fetchedAt.getDate() !== today.getDate()).splice(0, 10));
        }).catch(error => {
            console.log(error);
        })
    }, []);

    return <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
            <h2 style={{width: "100%", textAlign: "left"}}>Today's alerts</h2>

            <div>
                {todaysAlerts.map((alert, i) => <JournalistAlertComponent key={i} alert={alert}/>)}
            </div>
        </Grid>

        <Grid item xs={12} md={6}>
            <h2 style={{width: "100%", textAlign: "left"}}>Recent alerts</h2>

            <div>
                {recentAlerts.map((alert, i) => <JournalistAlertComponent key={`recent-alerts-${i}`} alert={alert}/>)}
            </div>
        </Grid>
    </Grid>
}
