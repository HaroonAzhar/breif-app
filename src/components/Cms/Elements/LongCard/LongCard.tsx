import { useMediaQuery } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import { Section } from "../../types";
import "./styles.scss";

export const LongCard = ({ section }: { section: Section }) => {
    const isMobile = useMediaQuery('(max-width: 1000px)');

    return (
        <div className={"content margin-v-md verticalCard"}>
            <h1 className={"title"} style={{ padding: isMobile ? "10px" : "0"}}>{section.title}</h1>
            <h3 className={"subtitle"} style={{ width: isMobile ? "90%" : "46%" }} >{section.subtitle}</h3>
            <div className={classNames("all-cards", !isMobile && "flex-row justify-around margin-h-md")}>
                {section.items.map(item => (
                    <div className={classNames("card", isMobile ? "card-mobile" : "card-web")}>
                        <img alt="" width={200} src={`${item.image}`} className={"image"} />
                        <div className={"paragraph"} >
                            <span dangerouslySetInnerHTML={{ __html: item.body }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
