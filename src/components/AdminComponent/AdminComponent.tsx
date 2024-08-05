import React, {useState} from "react";
import styles from "./styles.module.css";
import {Button, Grid, TextField} from "@material-ui/core";

export default function AdminComponent() {
    const [email, setEmail] = useState("");
    const [files, setFiles] = useState([]);

    const getFiles = async () => {
    }

    return <div className={styles.wrapper}>
        <h1>Admin</h1>

        <div className={styles.content}>
            <Grid container alignItems={"center"}>
                <Grid item xs={12}>
                    <TextField label={"Email"} onChange={event => setEmail(event.target.value)}/>

                    <Button variant={"contained"} color={"primary"} onClick={getFiles}>Get</Button>
                </Grid>

                <Grid item xs={12}>
                    {files.map((file: { url: string, name: string }) => <div>
                        <a href={file.url}>{file.name}</a>
                    </div>)}
                </Grid>
            </Grid>
        </div>
    </div>
}
