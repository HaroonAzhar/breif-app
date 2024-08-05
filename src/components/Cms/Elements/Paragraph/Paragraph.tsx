import { useMediaQuery } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import { Section } from "../../types";
import "./styles.scss";

export const Paragraph = ({ section }: { section: Section }) => {
    const isMobile = useMediaQuery('(max-width: 1000px)');

    return (
        <div className={classNames("content margin-v-md paragraph-root")}>
            <div className={classNames("paragraph", isMobile ? "paragraph-mobile" : "paragraph-web")} >
                <h1 className={classNames("title", isMobile ? "title-mobile" : "title-web")}>{section.title}</h1>
                <h3 className={classNames("subtitle", isMobile ? "subtitle-mobile" : "subtitle-web")} >{section.subtitle}</h3>
                <div className={"paragraph-set"}>
                    {section.items.map(item => (
                        <div className={classNames("paragraph-wrapper", isMobile ? "paragraph-wrapper-mobile" : "paragraph-wrapper-web")}>
                            <h3 className={"paragraph-title"}>{item.title}</h3>
                            <div className={"paragraph-content"} >
                                <span dangerouslySetInnerHTML={{ __html: item.body }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
