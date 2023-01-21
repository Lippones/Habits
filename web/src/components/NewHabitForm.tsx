import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from "phosphor-react";
import { FormEvent, useState } from 'react';
import { api } from '../lib/axios';

const avaliableWeekDays = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'
]

export function NewHabitForm() {
    const [title, setTitle] = useState('')
    const [weekDays, setWeekDays] = useState<number[]>([])
    async function createNewHabit(event: FormEvent) {
        event.preventDefault()
        if (!title || weekDays.length === 0) {
            return
        }
        try {
            await api.post('habits', {
                title,
                weekDays
            })
            setTitle('')
            setWeekDays([])
        } catch (error) {
            console.log('Oi')
        }
    }

    function hanldeToggleWeekDay(weekDay: number) {
        if (weekDays.includes(weekDay)) {
            const newWeekDays = weekDays.filter(day => day !== weekDay)
            setWeekDays(newWeekDays)
        } else {
            const weekDaysWithAddedOne = [...weekDays, weekDay]
            setWeekDays(weekDaysWithAddedOne)
        }
    }
    return (
        <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
            <label className="font-semibold leading-tight" htmlFor="title">Qual seu compromentimento?</label>
            <input type="text"
                id="title"
                placeholder="ex.: Exercícios, beber água, etc..."
                autoFocus
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
                onChange={event => setTitle(event.target.value)}
                value={title}
            />
            <label htmlFor="" className="font-semibold leading-tight mt-4">Qual a recorrência?</label>
            <div className='flex flex-col gap-2 mt-3'>
                {
                    avaliableWeekDays.map((weekDay, i) => {
                        return (
                            <Checkbox.Root
                                key={weekDay}
                                checked={weekDays.includes(i)}
                                className='flex items-center gap-3 group'
                                onCheckedChange={() => hanldeToggleWeekDay(i)}
                            >
                                <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500'>
                                    <Checkbox.Indicator>
                                        <Check size={20} className="text-white" />
                                    </Checkbox.Indicator>
                                </div>
                                <span className=" text-white leading-tight ">
                                    {weekDay}
                                </span>

                            </Checkbox.Root>
                        )
                    })
                }
            </div>
            <button type="submit" className="mt-6 rounded-lg p-4 gap-3 font-semibold bg-green-600 flex items-center justify-center hover:bg-green-500">
                <Check size={20} weight="bold" />
                Confimar
            </button>
        </form>
    )
}