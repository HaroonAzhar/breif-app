import {JournalistAlert} from "../../../../types/journalist-alerts";
import React, {useContext} from "react";
import {Button, Chip, Grid, Tooltip} from "@material-ui/core";
import UserContext from "../../../../Context/UserContext";

export const JournalistAlertComponent = ({alert}: { alert: JournalistAlert }) => {
    const {user} = useContext(UserContext);

    return <div style={{
        height: "fit-content",
        width: "100%",
        margin: "10px",
        background: "white",
        padding: "10px",
        borderRadius: "5px"
    }}>
        <Grid container>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={2}>
                        <img width={50} src={alert.profilePicture || "/default_avatar.png"}/>
                    </Grid>

                    <Grid item xs={8}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                {user?.subscription && <h4><a target={"_blank"}
                                                              href={`https://twitter.com/${alert.screenName}`}>{alert.name} | {alert.outlet}</a>
                                </h4>}
                                {!user?.subscription && <h4>{alert.name} | {alert.outlet}</h4>}

                                <span>{alert.fetchedAt.toDateString()} at {alert.fetchedAt.toTimeString()}</span>
                            </Grid>

                            <Grid item xs={12}>
                                <p style={{textAlign: "left"}}>{alert.text}</p>
                            </Grid>

                            <Grid item xs={12}>
                                {alert.sector && <Chip label={alert.sector.name} color={"primary"}/>}
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={2}>
                        <Tooltip title={user?.subscription ? "" : "Upgrade to premium to contact this reporter"}>
                            <div>
                                <Button
                                    variant={"contained"}
                                    disableElevation
                                    color={"primary"}
                                    disabled={!user?.subscription}
                                    target={"_blank"}
                                    href={alert.contact ? `mailto:${alert.contact}` : `https://twitter.com/${alert.screenName}`}
                                >
                                    Contact
                                </Button>
                            </div>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </div>
}
