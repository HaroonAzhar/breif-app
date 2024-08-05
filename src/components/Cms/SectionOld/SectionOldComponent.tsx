import {Section} from "../types";
import React from "react";
import {Button, Grid} from "@material-ui/core";
import styles from "./styles.module.css";
import ItemOldComponent from "../ItemOld/ItemOldComponent";
import classNames from "classnames";
import LazyLoad from "react-lazyload";

const SectionOldComponent = ({section, landing, first = false}: { section: Section, landing: boolean, first?: boolean }) => {
    if (section.horizontalLayout) {
        return <div className={"content margin-v-md"} style={{paddingTop: "100px", paddingBottom: "100px"}}>
            <h1>{section.title}</h1>
            <h3 className={styles.subtitle}>{section.subtitle}</h3>

            <div className={"flex-row justify-around margin-h-md"}>
                {section.items.map(item => <div style={{width: "33%"}}>
                    <img width={200} src={`${item.image}`} style={{width: "100%"}}/>

                    <span style={{textAlign: "center"}} dangerouslySetInnerHTML={{__html: item.body}}/>
                </div>)}
            </div>

            <div className={"flex-row justify-center"}>
                {section.genericButton &&
                    <Button
                        href={section.genericButton.url}
                        color={"primary"}
                        variant={"contained"}
                        disableElevation
                        style={{padding: "25px"}}
                    >
                        {section.genericButton.text}
                    </Button>}
            </div>


        </div>
    }

    if (section.showLogoBanner) {
        return <Grid container className={styles.logoBannerWrapper}>
            <Grid item xs={12}>
                <h4 style={{textAlign: "center", fontWeight: "normal"}}>{section.logoBanner.name}</h4>
            </Grid>

            <Grid item xs={12}>
                <div className={styles.logoWrapper}>
                    {section.logoBanner.logos.map(logo => <LazyLoad>
                        <div className={styles.logo}>
                            <img alt={"Logo"} src={logo.url}/>
                        </div>
                    </LazyLoad>)}
                </div>
            </Grid>
        </Grid>
    }

    return <Grid container
                 className={classNames(styles.wrapper, !landing && styles.noLandingPadding, first && styles.firstMargin)}>
        <Grid item xs={12}>
            <h1 className={styles.header}>{section.title}</h1>
            <h3 className={styles.subtitle}>{section.subtitle}</h3>
        </Grid>

        <Grid item xs={12}>
            <div className={styles.itemsContainer}>
                {section.items.map((item, index) => <div key={index} className={classNames(styles.item,
                    index === section.items.length - 1 && section.items.length % 2 === 0 ? styles.lastItemEven : null)}>
                    <ItemOldComponent item={item} index={index}/>
                </div>)}
            </div>
        </Grid>


        {section.video && <Grid item xs={12}>
            <div className={styles.video}>
                <LazyLoad>
                    <iframe width="100%" height="400" src={section.video} frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen title={"Video"}/>
                </LazyLoad>
            </div>
        </Grid>}


        <hr className={styles.lineBreak}/>
    </Grid>
}

export default SectionOldComponent;