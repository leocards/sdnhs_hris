export const getTimeFromNow = (date: string | number | Date): string => {
    // Convert the given date-time string to a Date object
    const givenDate = new Date(date);

    // Get the current date-time
    const currentDate = new Date();

    // Calculate the time difference in milliseconds
    const timeDifferenceMs = currentDate.getTime() - givenDate.getTime();

    // Convert milliseconds to seconds
    const timeDifferenceSeconds = Math.floor(timeDifferenceMs / 1000);

    // Convert to other time units
    const secondsInYear = 365.25 * 24 * 3600; // Account for leap years
    const secondsInMonth = secondsInYear / 12; // Average month length
    const secondsInWeek = 7 * 24 * 3600;
    const secondsInDay = 24 * 3600;

    const years = Math.floor(timeDifferenceSeconds / secondsInYear);
    const months = Math.floor(timeDifferenceSeconds / secondsInMonth);
    const weeks = Math.floor((timeDifferenceSeconds % secondsInMonth) / secondsInWeek);
    const days = Math.floor((timeDifferenceSeconds % secondsInWeek) / secondsInDay);
    const hours = Math.floor((timeDifferenceSeconds % secondsInDay) / 3600);
    const minutes = Math.floor((timeDifferenceSeconds % 3600) / 60);
    const seconds = timeDifferenceSeconds % 60;

    // Change the condition checks to reflect the correct time difference
    if (years > 0) return years + 'y';
    else if (months > 0) return months + 'mo';
    else if (weeks > 0) return weeks + 'w';
    else if (days > 0) return days + 'd';
    else if (hours > 0) return hours + 'h';
    else if (minutes > 0) return minutes + 'm';
    else return 'Just now';
}
