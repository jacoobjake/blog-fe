import { DEFAULT_INTL_OPTIONS } from "@/constants";

export function dateToDateString(date: Date) {
    return date.toLocaleDateString(undefined, DEFAULT_INTL_OPTIONS);
}

export function dateToDatetimeString(date: Date) {
    return `${dateToDateString(date)} ${date.toLocaleTimeString()} `;
}