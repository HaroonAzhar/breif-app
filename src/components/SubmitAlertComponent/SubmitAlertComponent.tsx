import React, {useState} from "react";
import {Button, LinearProgress, TextField} from "@material-ui/core";
import {postJournalistAlert} from "../../app/api";
import {toast} from "react-toastify";
import {InfoOutlined} from "@material-ui/icons";

const SubmitAlertComponent = () => {
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [address, setAddress] = useState("");
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const attemptSubmitAlert = async () => {
        setLoading(true);
        const ok = await postJournalistAlert({address, contact, name, text, date: (new Date())});
        setLoading(false);

        if (ok) {
            toast("Alert received!", {type: "success"});

            setName("");
            setContact("");
            setAddress("");
            setText("");
        } else {
            toast("Something went wrong.", {type: "error"});
        }
    }

    return <div className="page">
        <div className="content">
            <h1>Submit Alert</h1>

            <div className="margin-v-md">
                <div className="flex-row">
                    <TextField
                        label={"Name"}
                        type={"text"}
                        variant={"outlined"}
                        fullWidth
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="flex-row">
                    <TextField
                        label={"Email"}
                        type={"text"}
                        multiline
                        rows={5}
                        variant={"outlined"}
                        fullWidth
                        value={contact}
                        onChange={e => setContact(e.target.value)}
                        required
                    />
                </div>

                <div className="flex-row">
                    <TextField
                        label={"URL"}
                        type={"text"}
                        multiline
                        rows={5}
                        variant={"outlined"}
                        fullWidth
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                    />
                </div>

                <div className="flex-row">
                    <TextField
                        label={"Request"}
                        type={"text"}
                        multiline
                        rows={5}
                        variant={"outlined"}
                        fullWidth
                        value={text}
                        onChange={e => setText(e.target.value)}
                        required
                    />
                </div>

                <div className="info-box">
                    <InfoOutlined/>
                    <span>Your alert will be checked for quality and security reasons and published shortly after submission.</span>
                </div>

                <div className="flex-row">
                    <Button
                        color={"primary"}
                        variant={"contained"}
                        fullWidth
                        disableElevation
                        size={"large"}
                        disabled={!name || !contact || !text || loading}
                        onClick={attemptSubmitAlert}
                    >
                        Submit
                    </Button>
                </div>

                {loading && <LinearProgress/>}
            </div>
        </div>
    </div>
}

export default SubmitAlertComponent;
