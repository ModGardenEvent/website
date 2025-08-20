import Moment from "moment";

export const prerender = false;

export async function formatTime(time: string) : Promise<string> {
    return Moment(time).format("MM/D/YYYY h:mm A")
}

export function isoTime(time: string) : string {
    return Moment(time).toISOString()
}