import { Divider, useMediaQuery } from "@material-ui/core";
import React from "react";
import { Section } from "../../types";
import "./styles.scss";
import classNames from "classnames";
import { Item } from "./Item/Item";

export const SingleParagraph = ({ section }: { section: Section }) => {
    const isMobile = useMediaQuery('(max-width: 1000px)');

    return (
        <div className={"single-paragraph"}>
            {section.title && <h1 className={classNames("title", isMobile ? "title-mobile" : "title-web")}>{section.title}</h1>}
            {section.subtitle && <h3 className={classNames("subtitle", isMobile ? "subtitle-mobile" : "subtitle-web")}>{section.subtitle}</h3>}
            {section.items.map(item => <Item sectionItem={item} /> )}
            <Divider className={"divider divider-end"} />
        </div>
    )
}
