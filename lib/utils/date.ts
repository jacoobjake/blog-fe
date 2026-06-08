import { DEFAULT_INTL_OPTIONS } from "@/constants";

type DateInput = Date | string | number;

function toDate(date: DateInput): Date {
    const value = date instanceof Date ? date : new Date(date);
    return Number.isNaN(value.getTime()) ? new Date() : value;
}

export function dateToDateString(date: DateInput) {
    return toDate(date).toLocaleDateString(undefined, DEFAULT_INTL_OPTIONS);
}

export function dateToDatetimeString(date: DateInput) {
    const value = toDate(date);
    return `${dateToDateString(value)} ${value.toLocaleTimeString()} `;
}