import {PRCalendarEvent} from "../../../../types/pr-calendar";
import React, {useState} from "react";
import {IconButton} from "@material-ui/core";
import {ExpandLessOutlined, ExpandMoreOutlined} from "@material-ui/icons";

export const PRCalendarComponentEventGroupComponent = ({name, events, showAll}: { name: string, events: PRCalendarEvent[], showAll?: boolean }) => {
    const [hideEvents, setHideEvents] = useState(true);

    return <div>
        <h4>{name}</h4>

        {events.length === 0 && <span>No events</span>}

        <div>
            {(!hideEvents || showAll) && events.map(event => <div className={"margin-left-md"}>
                <h5>{event.name}</h5>
                <span>{event.date.toDateString()}</span>

                <pre>{event.text}</pre>
            </div>)}
        </div>


        {hideEvents && events.length > 0 && !showAll && <span>
            View events
            <IconButton onClick={() => setHideEvents(false)}>
                <ExpandMoreOutlined/>
            </IconButton>
        </span>}

        {!hideEvents && events.length > 0 && !showAll && <span>
            Hide events
            <IconButton onClick={() => setHideEvents(true)}>
                <ExpandLessOutlined/>
            </IconButton>
        </span>}

        <hr/>
    </div>
}
