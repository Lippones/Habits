import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const firstHabitId = '0730ffac-d039-4194-9571-01aa2aa0efbd'
const firstHabitCreationDate = new Date('2024-06-02T03:00:00.000')

const secondHabitId = '00880d75-a933-4fef-94ab-e05744435297'
const secondHabitCreationDate = new Date('2024-06-02T03:00:00.000')

const thirdHabitId = 'fa1a1bcf-3d87-4626-8c0d-d7fd1255ac00'
const thirdHabitCreationDate = new Date('2024-06-02T03:00:00.000')

async function run() {
    await prisma.habit.deleteMany({})
    await prisma.day.deleteMany({})
    /**
     * Create habits
     */
    await Promise.all([
        prisma.habit.create({
            data: {
                id: firstHabitId,
                title: 'Beber 2L água',
                created_at: firstHabitCreationDate,
                weekDays: {
                    create: [
                        { week_day: 1 }, // Segunda-feira
                        { week_day: 2 }, // Terça-feira
                        { week_day: 3 }, // Quarta-feira
                    ]
                }
            }
        }),

        prisma.habit.create({
            data: {
                id: secondHabitId,
                title: 'Exercitar',
                created_at: secondHabitCreationDate,
                weekDays: {
                    create: [
                        { week_day: 3 }, // Quarta-feira
                        { week_day: 4 }, // Quinta-feira
                        { week_day: 5 }, // Sexta-feira
                    ]
                }
            }
        }),

        prisma.habit.create({
            data: {
                id: thirdHabitId,
                title: 'Dormir 8h',
                created_at: thirdHabitCreationDate,
                weekDays: {
                    create: [
                        { week_day: 1 }, // Segunda-feira
                        { week_day: 2 }, // Terça-feira
                        { week_day: 3 }, // Quarta-feira
                        { week_day: 4 }, // Quinta-feira
                        { week_day: 5 }, // Sexta-feira
                    ]
                }
            }
        })
    ])

    await Promise.all([
        /**
         * Habits (Complete/Available): 3/3
         */
        prisma.day.create({
            data: {
                /** Monday */
                date: new Date('2024-06-10T03:00:00.000Z'),
                dayHabits: {
                    create: [
                        { habit_id: firstHabitId },
                        { habit_id: secondHabitId },
                        { habit_id: thirdHabitId },
                    ]
                }
            }
        }),

        /**
         * Habits (Complete/Available): 2/2
         */
        prisma.day.create({
            data: {
                /** Tuesday */
                date: new Date('2024-06-11T03:00:00.000Z'),
                dayHabits: {
                    create: [
                        { habit_id: firstHabitId },
                        { habit_id: thirdHabitId },
                    ]
                }
            }
        }),

        /**
         * Habits (Complete/Available): 3/3
         */
        prisma.day.create({
            data: {
                /** Wednesday */
                date: new Date('2024-06-12T03:00:00.000Z'),
                dayHabits: {
                    create: [
                        { habit_id: firstHabitId },
                        { habit_id: secondHabitId },
                        { habit_id: thirdHabitId },
                    ]
                }
            }
        }),

        /**
         * Habits (Complete/Available): 2/2
         */
        prisma.day.create({
            data: {
                /** Thursday */
                date: new Date('2024-06-13T03:00:00.000Z'),
                dayHabits: {
                    create: [
                        { habit_id: secondHabitId },
                        { habit_id: thirdHabitId },
                    ]
                }
            }
        }),

        /**
         * Habits (Complete/Available): 3/3
         */
        prisma.day.create({
            data: {
                /** Friday */
                date: new Date('2024-06-14T03:00:00.000Z'),
                dayHabits: {
                    create: [
                        { habit_id: secondHabitId },
                        { habit_id: firstHabitId },
                        { habit_id: thirdHabitId },
                    ]
                }
            }
        })
    ])
}

run()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })