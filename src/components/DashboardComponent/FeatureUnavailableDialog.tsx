import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

export const DisableUnavilableFeatureDialog = ({open, setOpen}: {open: boolean, setOpen: (next: boolean) => void}) => {
    const history = useHistory();
    return <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>This feature is only available in Pro subscription.</DialogTitle>

        <DialogActions>
            <Button variant={"contained"} disableElevation color={"primary"} onClick={() => history.push("/pricing")}>Upgrade</Button>
            <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
    </Dialog>
}
