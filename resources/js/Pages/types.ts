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

export const formatDateRange = (dateRange: {
    from: string;
    to: string;
}): string => {
    const { from, to } = dateRange;

    const fromFormatted = format(from, "MMMM d, yyyy");

    if (!to) {
        // Single date
        return fromFormatted;
    } else if (format(from, "yyyy") === format(to, "yyyy")) {
        if (format(from, "MMMM") === format(to, "MMMM")) {
            // Same month and year
            return `${format(from, "MMMM d")} - ${format(to, "d, yyyy")}`;
        } else {
            // Same year, different month
            return `${format(from, "MMMM d")} - ${format(
                to,
                "MMMM d, yyyy"
            )}`;
        }
    } else {
        // Different years
        return `${fromFormatted} - ${format(to, "MMMM d, yyyy")}`;
    }
};
