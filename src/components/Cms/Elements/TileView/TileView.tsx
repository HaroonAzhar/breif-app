import { Grid, useMediaQuery } from "@material-ui/core";
import React from "react";
import { Section } from "../../types";
import "./styles.scss";
import classNames from "classnames";
import { Item } from "./Item/Item";

export const TileView = ({ section }: { section: Section }) => {
    const isMobile = useMediaQuery('(max-width: 1000px)');

    return (
        <Grid container className={classNames("tile-view", isMobile ? "tile-view-mobile" : "tile-view-web")}>
            <Grid item xs={12}>
                <h1 className={"title"}>{section.title}</h1>
                <h3 className={classNames("subtitle", isMobile ? "subtitle-mobile" : "subtitle-web")}>{section.subtitle}</h3>
            </Grid>
            <Grid container xs={12} spacing={4} className={"tile-item-wrapper"}>
                {section.items.filter(item => item.title).map((item, index) => (
                    <Item item={item} index={index} />
                ))}
            </Grid>
        </Grid>
    )
}
