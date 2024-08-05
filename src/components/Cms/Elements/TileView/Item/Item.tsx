import React from "react";
import { SectionItem } from "../../../types";
import { Button, Grid, useMediaQuery } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import LazyLoad from 'react-lazyload';
import "../styles.scss";
import classNames from "classnames";

export const Item = ({ item, index }: { item: SectionItem, index: number }) => {
    const history = useHistory();
    const isMobile = useMediaQuery('(max-width: 1000px)');

    return (
        <Grid item xs={isMobile ? 12 : 6} spacing={isMobile ? 2 : 4}>
            <div className={"tile-item"}>
                {!isMobile && <h1 className={classNames("tile-number")}>{index + 1}</h1>}
                {item.image &&
                    <LazyLoad style={{textAlign: "center"}}>
                        <img className={"image"} alt={"Item"} src={item.image} />
                    </LazyLoad>
                }
                <h2 className={"title"}>{item.title}</h2>
                <pre className={"tile-content"} dangerouslySetInnerHTML={{ __html: item.body }} />
                {item.showButton &&
                    <Button
                        disableElevation
                        className={"action-button"}
                        color={"primary"}
                        variant={"contained"}
                        onClick={() => history.push(item.buttonLink)}
                    >{item.buttonTitle}</Button>
                }
            </div>
        </Grid>
    )
}
