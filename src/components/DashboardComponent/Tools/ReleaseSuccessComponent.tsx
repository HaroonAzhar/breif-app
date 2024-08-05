import React from "react";
import {useParams} from "react-router-dom";

export const ReleaseSuccessComponent = () => {
    const {action} = useParams();

    let message = "";
    switch (action) {
        case "send":
            message = "Your release has been sent out.";
            break;
        case "scheduled":
            message = "Your release has been scheduled.";
            break;
        default:
            message = "Your release has been returned for review.";
            break;
    }

    return <div>
        <h3>Success!</h3>

        <h4>{message}</h4>
    </div>
}
