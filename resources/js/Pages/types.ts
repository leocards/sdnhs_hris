import { format } from "date-fns";

export const requiredError = (field: string) => `The ${field} field is required.`;

export function checkDateFormat(input: string, formatDate: string = 'P') {
    // Regex to match a full date (YYYY-MM-DD)
    const fullDateRegex = /^\d{4}-\d{2}-\d{2}$/;

    // Regex to match a year (YYYY)
    const yearRegex = /^\d{4}$/;

    if (fullDateRegex.test(input)) {
        return format(input, formatDate);
    } else if (yearRegex.test(input)) {
        return input;
    } else {
        return input;
    }
}

export function isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
}
