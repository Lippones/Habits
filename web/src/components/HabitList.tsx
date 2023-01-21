import { Check } from 'phosphor-react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import { Title } from '@radix-ui/react-dialog';
import dayjs from 'dayjs';

interface Props {
    date: Date
    onCompletedChange: (completed: number) => void
}
interface HabitsInfo {
    possibleHabits: Array<{
        id: string,
        title: string,
        created: string,
    }>,
    completedHabits: string[]
}
export function HabitList({ date, onCompletedChange }: Props) {
    const [habitInfo, setHabitInfo] = useState<HabitsInfo>()
    useEffect(() => {
        api.get('day', {
            params: {
                date: date.toISOString()
            }
        }).then((response) => {
            setHabitInfo(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])


    async function hanldeToggleHabit(habitid: string) {
        await api.patch(`/habits/${habitid}/toggle`)
        const isHabitAlreadyCompleted = habitInfo!.completedHabits.includes(habitid)
        let completedHabits: string[] = []
        if (isHabitAlreadyCompleted) {
            completedHabits = habitInfo!.completedHabits.filter(id => id !== habitid)
        } else {
            completedHabits = [...habitInfo!.completedHabits, habitid]
        }
        setHabitInfo({
            possibleHabits: habitInfo!.possibleHabits,
            completedHabits,
        })
        onCompletedChange(completedHabits.length)
    }
    const isDateInPast = dayjs(date).endOf('day').isBefore(new Date())
    return (
        <div className='mt-6 flex flex-col gap-3'>
            {
                habitInfo?.possibleHabits.map(habit => {
                    return (
                        <Checkbox.Root
                            key={habit.id}
                            onCheckedChange={() => hanldeToggleHabit(habit.id)}
                            className='flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed'
                            checked={habitInfo.completedHabits.includes(habit.id)}
                            disabled={isDateInPast}

                        >
                            <div className=' transition-colors h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-bg'>
                                <Checkbox.Indicator >
                                    <Check size={20} className="text-white" />
                                </Checkbox.Indicator>
                            </div>
                            <span
                                className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400"
                            >{habit.title}</span>

                        </Checkbox.Root>
                    )
                })
            }

        </div>
    )
}