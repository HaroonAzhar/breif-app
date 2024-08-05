export interface PRCalendarEvent {
    date: Date,
    name: string,
    text: string
}

export const PRCalendarEventMapper = (data: any): PRCalendarEvent => {
    const date = new Date(data?.date);

    return {
        date,
        name: data?.name,
        text: data?.text
    }
}
