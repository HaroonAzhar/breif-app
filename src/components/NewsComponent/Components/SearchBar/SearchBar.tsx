import { Grid, TextField } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import React from "react";

export function SearchBar() {
    return (
        <Grid container item xs={12}>
            <Grid item xs={6}>
                <div style={{ margin: "18px 0", fontSize: 24, fontWeight: 500 }}>
                    Latest News
                </div>
            </Grid>
            <Grid container item xs={6} justify="flex-end" alignItems="center">
                <Search style={{ marginRight: 8, height: "100%" }} />
                <TextField placeholder="Search" variant="standard" />
            </Grid>
        </Grid>
    )
}
