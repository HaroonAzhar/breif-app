import { Grid, useMediaQuery } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import LazyLoad from "react-lazyload";
import { Section } from "../../types";
import "./styles.scss";
import Carousel from "react-material-ui-carousel";

export const LogoBanner = ({ section }: { section: Section }) => {
    const isMobile = useMediaQuery('(max-width: 1000px)');

    return (
        <Grid container className={"logo-banner"}>
            <Grid item xs={12}>
                <h1 className={classNames("title", isMobile ? "title-mobile" : "title-web")}>{section.logoBanner.name}</h1>
            </Grid>
            <Grid item xs={12}>
                <div className={classNames("logo-wrapper", isMobile ? "logo-wrapper-mobile" : "logo-wrapper-web")}>
                    {isMobile ? 
                    <Carousel
                        interval={3000}
                        animation="slide"
                        navButtonsAlwaysInvisible={true}
                        indicatorContainerProps={{style: {transform: "scale(0.7)", marginBottom: 20}}}
                    >
                        {section.logoBanner.logos.map(logo =>
                            <LogoItem url={logo.url} />
                        )}
                    </Carousel> :
                        section.logoBanner.logos.map(logo =>
                            <LogoItem url={logo.url} />
                        )
                    }
                </div>
            </Grid>
        </Grid>
    )
}

function LogoItem({url} : {url: string}) {
    const isMobile = useMediaQuery('(max-width: 1000px)');

    return (
        <LazyLoad>
            <div className={classNames("logo-image", isMobile ? "logo-image-mobile" : "logo-image-web")}>
                <img alt={"Logo"} src={url} className={"image"}/>
            </div>
        </LazyLoad>
    )
}