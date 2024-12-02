export function getRemainingTime(targetDate: Date): {
    days: number, hours: number, minutes: number, seconds: number, isToday: boolean
} {
    const now = new Date();
    const timeDifference = targetDate.getTime() - now.getTime();

    if (timeDifference <= 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isToday: new Date(now.getTime()).setHours(0,0,0,0) == new Date(targetDate.getTime()).setHours(0,0,0,0)
        }
    } else {
        return {
            days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
            isToday: new Date(now.getTime()).setHours(0,0,0,0) == new Date(targetDate.getTime()).setHours(0,0,0,0)
        }
    }
}
