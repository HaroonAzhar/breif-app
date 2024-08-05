import React, {useEffect, useState} from "react";
import {PRCalendarEvent, PRCalendarEventMapper} from "../../../../types/pr-calendar";
import {getPRCalendar} from "../../../../app/api";
import {Container, Grid} from "@material-ui/core";
import {PRCalendarComponentEventGroupComponent} from "./PRCalendarEventGroupComponent";

export const PRCalendarComponent = () => {
    const [events, setEvents] = useState<PRCalendarEvent[]>([]);

    const today = new Date();

    let months = [
        {name: "January", index: 0},
        {name: "February", index: 1},
        {name: "March", index: 2},
        {name: "April", index: 3},
        {name: "May", index: 4},
        {name: "June", index: 5},
        {name: "July", index: 6},
        {name: "August", index: 7},
        {name: "September", index: 8},
        {name: "October", index: 9},
        {name: "November", index: 10},
        {name: "December", index: 11},
    ];

    months = months.filter((month, index) => index > today.getMonth());

    useEffect(() => {
        getPRCalendar().then(events => {
            let _events: PRCalendarEvent[] = events.map((e: any) => PRCalendarEventMapper(e));
            _events = _events.sort((a, b) => a.date.getTime() - b.date.getTime());


            _events = _events.filter(e => e.date.getTime() > today.getTime());

            setEvents(_events);
        });
    }, []);

    const getMonthsEvents = (month: number) => {
        return events.filter(e => e.date.getMonth() === month);
    }

    return <Container>
        <h1 style={{textAlign: "left"}}>PR Calendar</h1>

        <h5 style={{textAlign: "left", color: "black"}}>Below is a list of upcoming awareness days, events and moments
            throughout the
            year that offer PR opportunities for brands.</h5>

        <hr/>

        <Grid container>
            <Grid item xs={6}>
                <h3>This month</h3>

                <PRCalendarComponentEventGroupComponent
                    showAll
                    name={""}
                    events={events.filter(event => event.date.getMonth() === today.getMonth())}
                />
            </Grid>

            <Grid item xs={6}>
                <h3>Coming up</h3>

                {months.map((month) =>
                    <PRCalendarComponentEventGroupComponent name={month.name} events={getMonthsEvents(month.index)}/>)}
            </Grid>
        </Grid>
    </Container>

}
