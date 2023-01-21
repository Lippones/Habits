export function generateProgressPercentage(total: number, compledted: number) {
    return Math.round((compledted / total) * 100)
}