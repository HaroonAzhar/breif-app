import { Button } from "@material-ui/core";
import React from "react";
import { Section } from "../../types";
import { useHistory } from "react-router-dom";
import "./styles.scss";
import classNames from "classnames";

export const ButtonSection = ({ section, variant }: { section: Section, variant: string }) => {
    const history = useHistory();

    return (
        <div className={classNames("button-section-root", 
        variant === "white" ? "button-section-root-white" : 
        variant === "grey" ? "button-section-root-grey" : null)}>
            {section.items.map(item => (
                <div className={"buttons"}>
                    <Button 
                        disableElevation
                        color={"primary"}
                        variant={"contained"}
                        onClick={() => history.push(item.buttonLink)}
                    >{item.buttonTitle}</Button>
                </div>
            ))}
        </div>
    )
}
