import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";

export const PressCoverageUpdateDialog = ({ open, setOpen, data }: { open: boolean, setOpen: (b: boolean) => void, data: any }) => {
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            scroll={"paper"}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            fullWidth={true}
            maxWidth={'lg'}
        >
            <DialogTitle id="scroll-dialog-title">Updated Press Coverages</DialogTitle>
            <DialogContent dividers={true}>
                <DialogContentText
                    id="scroll-dialog-description"
                    tabIndex={-1}
                >
                    {(!data || data === "") ? "Please wait..." : (
                        <>
                            {JSON.parse(data).map((item: any) => {
                                return (
                                    <p style={{fontWeight: Array.from(item.newPressCoverage).length > 0 ? "bold" : "normal"}}>
                                        {`${item.username}: ${Array.from(item.newPressCoverage).length} New Coverage`}</p>
                                )
                            })}
                        </>
                    )}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}
