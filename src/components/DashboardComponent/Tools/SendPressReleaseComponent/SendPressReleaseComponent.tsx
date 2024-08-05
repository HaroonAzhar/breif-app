import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, Card, CardContent, CardHeader, Grid, TextField, Typography} from "@material-ui/core";
import {postPressRelease} from "../../../../app/api";
import {toast} from "react-toastify";
import UserContext from "../../../../Context/UserContext";
import {useHistory} from "react-router-dom";
import {AudienceAnalysisComponent} from "./AudienceAnalysisComponent";
import ReactQuill, { Quill } from "react-quill";
import Editor from "../../../RichTextEditor/TextEditor";


const SendPressReleaseComponent = () => {
    const [pressRelease, setPressRelease] = useState<File | null>(null);
    const [moreInfo, setMoreInfo] = useState("");

    const history = useHistory();
    const {user} = useContext(UserContext);

    const fileUploadElement = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
    }, []);

    if (!user) {
        history.push("/dashboard");
    }

    const sendPressRelease = () => {
        // console.log("slected jorunalist", jourr)
        if (!pressRelease) {
            return;
        }


        postPressRelease(pressRelease, moreInfo).then(response => {
            setPressRelease(null);
            setMoreInfo("");
            toast("Press release sent!", {type: "success"});
        }).catch(() => {
            toast("Something went wrong. Please try again.", {type: "error"});
        });
    }

    const handlePressReleaseOnChange = (files: FileList | null) => {
        if (!files) {
            return;
        }

        if (files?.length > 0) {
            setPressRelease(files[0]);
        }
    }

    return <div className={"flex-row margin-h-md align-start"}>
        <Grid container justify={"flex-start"}>
            <Grid item xs={12} md={6}>
                <Card style={{width: "500px", maxWidth: "90%"}}>
                    <CardHeader title={"Send in your press release"}/>

                    <CardContent>
                        <Grid container spacing={5}>
                            <Grid item xs={12}>
                                <Typography variant={"body2"} align={"left"}>
                                    Send us your press release to receive a report via email about the potential reach,
                                    sectors
                                    and titles your press release could be sent to.
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <input
                                    ref={fileUploadElement}
                                    hidden
                                    type={"file"}
                                    onChange={e => handlePressReleaseOnChange(e.target.files)}
                                />

                                <Button
                                    onClick={() => console.log(fileUploadElement?.current?.click())}
                                    variant={"outlined"}
                                    color={"primary"}
                                >
                                    Choose file
                                </Button>

                                <Typography variant={"body2"} align={"left"}>
                                    {pressRelease?.name}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                {/* <TextField
                                    value={moreInfo}
                                    onChange={e => setMoreInfo(e.target.value)}
                                    variant={"outlined"}
                                    fullWidth
                                    multiline
                                    rows={5}
                                    label={"Anything else you want to include"}
                                />
                                 <ReactQuill value={moreInfo}
                  onChange={(e) => setMoreInfo(e)} /> */}

                   <Editor value={moreInfo}
                                    onChange={e => setMoreInfo(e)} />
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    color={"primary"}
                                    variant={"contained"}
                                    onClick={sendPressRelease}
                                    disabled={!pressRelease}
                                >
                                    Analyse
                                </Button>
                            </Grid>


                            {/*{!user?.subscription && <Grid item xs={12}>*/}
                            {/*    <span>This is a premium feature. Upgrade your account to gain access.</span>*/}
                            {/*</Grid>}*/}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={6}>
                <AudienceAnalysisComponent/>
            </Grid>
        </Grid>


    </div>
}

export default SendPressReleaseComponent;
