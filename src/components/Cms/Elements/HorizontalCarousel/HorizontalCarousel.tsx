import { Grid, useMediaQuery } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import Carousel from "react-material-ui-carousel";
import { Section } from "../../types";
import { Item } from "./Item/Item";
import "./styles.scss";

export const HorizontalCarousel = ({ section }: { section: Section }) => {
    const isMobile = useMediaQuery('(max-width: 1000px)');

    return (
        <div className={classNames("content margin-v-md", "horizontal-carousel")}>
            <h1 className={"title"} style={{ padding: isMobile ? "10px" : "0" }}>{section.title}</h1>
            <h3 className={"subtitle"} style={{ width: isMobile ? "90%" : "46%" }}>{section.subtitle}</h3>
            <div className={"all-cards"}>
                <Grid container>
                    <Carousel interval={3000} animation="slide" >
                        {section.items.map((item) => (
                            <Item sectionItem={item} />
                        ))}
                    </Carousel>
                </Grid>
            </div>
        </div>
    )
}