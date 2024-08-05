import {StepOption} from "./types";
import React from "react";
import {Button} from "@material-ui/core";

export const renderConfig: { [id: string]: any } = {
    "checkbox": (option: StepOption): any => {
        return <div>

        </div>
    },
    "button": (option: StepOption): any => {
        let onClick: () => {};

        if (option.next) {
            // On click = step
        }

        return <div>
            <Button variant={"outlined"}>{option.text}</Button>
        </div>
    },
    "conditionalButton": (option: StepOption): any => {
        return <div>

        </div>
    },
    "input": (option: StepOption): any => {
        return <div>

        </div>
    }
}
