import { Grid, useMediaQuery } from "@material-ui/core";
import React from "react";
import { SectionItem } from "../../../types";
import { useHistory } from "react-router-dom";
import "../styles.scss";
import classNames from "classnames";

export const Item = ({ sectionItem }: { sectionItem: SectionItem }) => {
    const isMobile = useMediaQuery('(max-width: 1000px)');
    const history = useHistory();

    const onClick = () => history.push(sectionItem.buttonLink);
    
    return (
        <Grid container xs={12} className={isMobile ? "carousel-item-mobile" : "carousel-item-web"}>
            <div onClick={onClick} className={classNames("horizontalCard")} style={{ display: isMobile ? "" : "inline-flex" }}>
                <Grid item xs={isMobile ? 12 : 4}>
                    <img alt="" src={`${sectionItem.image}`} className={"image"} />
                </Grid>
                <Grid item xs={isMobile ? 12 : 8}>
                    <div className={classNames("paragraph", isMobile ? "paragraph-mobile" : "paragraph-web")} >
                        <span dangerouslySetInnerHTML={{ __html: sectionItem.body }} />
                    </div>
                </Grid>
            </div>
        </Grid>
    )
}