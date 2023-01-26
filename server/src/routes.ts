import { prisma } from "./lib/prisma"
import { z } from 'zod'
import { FastifyInstance } from "fastify"
import dayjs from "dayjs"



export async function appRoutes(app: FastifyInstance) {
    app.get('/', async (req) => {
        return await prisma.habit.findMany()
    })
    app.get('/day', async (req) => {
        const getDayParams = z.object({
            date: z.coerce.date()
        })
        const { date } = getDayParams.parse(req.query)
        const parsedDate = dayjs(date).startOf('day')
        const weekDay = dayjs(date).get('day')
        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date
                },
                weekDays: {
                    some: {
                        week_day: weekDay
                    }
                }
            }

        })
        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate()
            },
            include: {
                dayHabits: true
            }
        })
        const completedHabits = day?.dayHabits.map(dayHabit => {
            return dayHabit.habit_id
        }) ?? []
        return {
            possibleHabits,
            completedHabits

        }
    })
    app.post('/habits', async (req) => {
        const createHabitbody = z.object({
            title: z.string(),
            weekDays: z.array(
                z.number().min(0).max(6)
            )
        })
        const today = dayjs().startOf('day').toDate()
        const { title, weekDays } = createHabitbody.parse(req.body)
        await prisma.habit.create({
            data: {
                title,
                created_at: today,
                weekDays: {
                    create: weekDays.map(weekDay => {
                        return {
                            week_day: weekDay
                        }
                    })
                }
            }
        })

    })
    app.patch('/habits/:id/toggle', async (req) => {
        const toggleHabitParams = z.object({
            id: z.string().uuid()
        })

        const { id } = toggleHabitParams.parse(req.params)
        const today = dayjs().startOf('day').toDate()

        let day = await prisma.day.findUnique({
            where: {
                date: today,
            }
        })
        if (!day) {
            day = await prisma.day.create({
                data: {
                    date: today
                }
            })
        }
        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id
                }
            }
        })
        if (dayHabit) {
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id
                }
            })
        } else {
            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id
                }
            })
        }

    })
    app.get('/summary', async (req, res) => {
        const summary = await prisma.$queryRaw`
            SELECT 
            D.id,
            D.date,
            (
                select 
                cast(count(*) as float) 
                from day_habits DH 
                where DH.day_id = D.id
            )as completed,
            (
                select
                cast(count(*) as float)
                from habit_week_days HWD
                join habits H
                on H.id = HWD.habit_id
                where
				HWD.week_day = cast(to_char((D.date)::TIMESTAMP,'ww') as int)
				and H.created_at <= D.date
            ) as amount
            FROM days D
        `

        return summary
    })
}
/*
SELECT 
            D.id,
            D.date,
            (
                select 
                cast(count(*) as float) 
                from day_habits DH 
                where DH.day_id = D.id
            )as completed,
            (
                select
                cast(count(*) as float)
                from habit_week_days HWD
                join habits H
                on H.id = HWD.habit_id
                where
                    HWD.week_day = to_timestamp(cast(D.date/1000 as int))
                    and H.created_at <= D.date
            ) as amount
            FROM days D
*/