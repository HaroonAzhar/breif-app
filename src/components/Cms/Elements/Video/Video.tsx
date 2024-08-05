import { Grid, useMediaQuery } from "@material-ui/core";
import React from "react";
import { Section } from "../../types";
import "./styles.scss";
import classNames from "classnames";
import LazyLoad from "react-lazyload";

export const Video = ({ section }: { section: Section }) => {
    const isMobile = useMediaQuery('(max-width: 1000px)');

    return (
        <Grid container spacing={1} className={classNames("video-wrapper", isMobile ? "video-wrapper-mobile" : "video-wrapper-web")}>
            <Grid item xs={12}>
                <h1 className={"title"}>{section.title}</h1>
                <h3 className={classNames("subtitle", isMobile ? "subtitle-mobile" : "subtitle-web")}>{section.subtitle}</h3>
            </Grid>
            <Grid item xs={12}>
                <div className={"video"}>
                    <LazyLoad>
                        <iframe 
                            width="100%" height="400" src={section.video} frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen title={"Video"} />
                    </LazyLoad>
                </div>
            </Grid>
        </Grid>
    )
}
