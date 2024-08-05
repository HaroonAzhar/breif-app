import "./styles.scss";
import React from "react";
import { LandingBanner } from "../types";
import { Button, Grid, useMediaQuery } from "@material-ui/core";
import { cmsURL } from "../../../app/api";
import classNames from "classnames";

const LandingBannerComponent = ({ banner }: { banner: LandingBanner }) => {
    const isMobile = useMediaQuery('(max-width: 1000px)');
    console.log("banner", banner);
    const singleButton = banner.landingButton.length === 1;

    return (
        <div className={"landing-banner"}>
            <Grid container item xs={12} spacing={isMobile ? 0 : 3}>
                <Grid item xs={isMobile ? 12 : 6}>
                    <div className={classNames("left-container", isMobile ? "left-container-mobile" : "left-container-web")}>
                        <h1 className={"title"}>{banner.title}</h1>
                        <h3 className={classNames("subtitle", isMobile ? "subtitle-mobile" : "subtitle-web")}>{banner.subtitle}</h3>

                        <div className={"button-container"}>
                            {singleButton ? (
                                <SingleButton banner={banner} />
                            ) : banner.landingButton.map((lb, index) =>
                                <MultipleButton text={lb.text} link={lb.link} index={index} />
                            )}
                        </div>
                    </div>
                </Grid>
                {!isMobile && (
                    <Grid item xs={6} className={"image-container"}>
                        <div className={"image-wrapper"}>
                            <img
                                className={"image"}
                                alt={"Hero"}
                                src={banner.bannerImage ? `${cmsURL}${banner.bannerImage}` : "/banner-image.png"} />
                        </div>
                    </Grid>
                )}
            </Grid>
        </div>
    )

}

function SingleButton({ banner }: { banner: LandingBanner }) {
    return (
        <div className={"button-wrapper"}>
            <Button
                className={"main-button main-button-single"}
                color={"primary"}
                variant={"contained"}
                href={banner.landingButton[0].link}
            >{banner.landingButton[0].text}</Button>
        </div>
    )
}

function MultipleButton({ text, link, index }: { text: string, link: string, index: number }) {
    return (
        <div className={"button-wrapper"}>
            <Button
                className={classNames("main-button", index % 2 === 0 ? "main-button-multiple-even" : "main-button-multiple-odd")}
                color={"primary"}
                variant={index % 2 === 0 ? "contained" : "outlined"}
                href={link}
            >{text}</Button>
        </div>
    )
}

export default LandingBannerComponent;
