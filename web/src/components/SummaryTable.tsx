import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { api } from "../lib/axios"
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-begining"
import { HabitDay } from "./HabitDay"
import { WeekDay } from "./WeekDay"
const weekDay = [
    "S",
    "T",
    "Q",
    "Q",
    "S",
    "S",
    "D",]
const summaryDates = generateDatesFromYearBeginning()
const minumumSummaryDateSizes = 18 * 7
const amountOfDateToFill = minumumSummaryDateSizes - summaryDates.length

type Summary = {
    id: string;
    date: string;
    amount: number;
    completed: number
}[]

export function SummaryTable() {
    const [summary, setSumarry] = useState<Summary>([])
    useEffect(() => {
        api.get('/summary').then(res => {
            setSumarry(res.data)
        })
    }, [])
    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                {weekDay.map((weekDay, i) => {
                    return (
                        <WeekDay key={`${weekDay}-${i}`} day={weekDay} />
                    )
                })}
            </div>
            <div className="grid grid-rows-7 grid-flow-col gap-3">
                {summary.length > 0 && summaryDates.map((date) => {
                    const dayinSummary = summary.find(day => {
                        return dayjs(date).isSame(day.date, 'day')
                    })
                    return (
                        <HabitDay
                            date={date}
                            amount={dayinSummary?.amount}
                            defaultCompleted={dayinSummary?.completed}
                            key={date.toString()} />
                    )
                })}
                {amountOfDateToFill > 0 && Array.from({ length: amountOfDateToFill }).map((_, i) => {
                    return (
                        <div key={i} className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"></div>
                    )
                })}
            </div>
        </div>
    )
}