import { Button, Divider, Grid, useMediaQuery } from "@material-ui/core";
import React from "react";
import { SectionItem } from "../../../types";
import { useHistory } from "react-router-dom";
import "../styles.scss";
import classNames from "classnames";

export const Item = ({ sectionItem }: { sectionItem: SectionItem }) => {
    const isMobile = useMediaQuery('(max-width: 1000px)');
    const history = useHistory();

    return (
        <div className={"single-paragraph-item"}>
            <Divider className={"divider"} />
            {isMobile ? (
                <>
                    <Grid container item xs={12} spacing={3} alignItems="center" justify="center" className={classNames("wrapper", "wrapper-mobile")}>
                        {sectionItem.image && <Grid item xs={12}>
                            <img alt="" src={`${sectionItem.image}`} className={"image"} />
                        </Grid>}
                        <Grid item xs={12}>
                            <h3 className={"paragraph-title"} >{sectionItem.title}</h3>
                            <div className={"paragraph-content"} >
                                <span dangerouslySetInnerHTML={{ __html: sectionItem.body }} />
                            </div>
                            <Button
                                className={"paragraph-button"}
                                disableElevation
                                color={"primary"}
                                variant={"outlined"}
                                onClick={() => history.push(sectionItem.buttonLink)}
                            >{sectionItem.buttonTitle}</Button>
                        </Grid>
                    </Grid>
                </>
            ) : (
                <>
                    <Grid container item xs={12} spacing={3} alignItems="center" justify="center" className={classNames("wrapper", "wrapper-web")}>
                        <Grid item xs={sectionItem.image ? 6 : 12}>
                            <h3 className={"paragraph-title"} style={{ textAlign: sectionItem.image ? "left" : "center" }}>{sectionItem.title}</h3>
                            <div className={"paragraph-content"} style={{ textAlign: sectionItem.image ? "left" : "center" }} >
                                <span dangerouslySetInnerHTML={{ __html: sectionItem.body }} />
                            </div>
                            <Button
                                className={classNames("paragraph-button", "paragraph-button-web")}
                                style={{width: sectionItem.image ? "auto" : "100%"}}
                                disableElevation
                                color={"primary"}
                                variant={"outlined"}
                                onClick={() => history.push(sectionItem.buttonLink)}
                            >{sectionItem.buttonTitle}</Button>
                        </Grid>
                        {sectionItem.image && <Grid item xs={6}>
                            <img alt="" src={`${sectionItem.image}`} className={"image"} />
                        </Grid>}
                    </Grid>
                </>
            )}
        </div>
    )
}