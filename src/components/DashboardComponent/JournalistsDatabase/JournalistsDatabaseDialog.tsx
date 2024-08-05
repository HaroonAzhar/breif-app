import React, {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import {postJournalistsDatabaseUpload} from "../../../app/api";
import {toast} from "react-toastify";

export const JournalistsDatabaseDialog = ({open, setOpen}: { open: boolean, setOpen: (b: boolean) => void }) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const attemptUpload = async () => {
        if (!file) {
            return;
        }

        setLoading(true);

        try {
            const ok = await postJournalistsDatabaseUpload(file);

            if (ok) {
                toast("Upload success", {type: "success"});
                setOpen(false);
            } else {
                toast("Failed to upload", {type: "error"});
            }
        } catch (e) {
            toast(e.message, {type: "error"});
        }

        setLoading(false);
    }

    return <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Upload new journalists</DialogTitle>
        <DialogContent>
            <input
                type={"file"}
                onChange={e => {
                    if (e.target.files) {
                        setFile(e.target.files[0]);
                    }
                }}
            />
        </DialogContent>
        <DialogActions>
            <Button
                disabled={!file || loading}
                color={"primary"}
                variant={"contained"}
                disableElevation
                onClick={attemptUpload}
            >
                {loading ? "Loading" : "Upload"}
            </Button>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogActions>
    </Dialog>
}
