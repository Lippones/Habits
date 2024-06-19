import { TouchableOpacity, Dimensions, TouchableOpacityProps } from 'react-native';
import { generateProgressPercentage } from '../utils/genarate-progress-percentage'
import clsx from 'clsx';
import dayjs from 'dayjs';

const weekDays = 7
const screenHorizontalPadding = (32 * 2) / 5
export const dayMarginBetween = 8
export const daySize = (Dimensions.get('screen').width / weekDays) - (screenHorizontalPadding + 5)

interface Props extends TouchableOpacityProps {
    amountOfHabit?: number
    amountCompleted?: number
    date: Date
}

export function HabitDay({ amountCompleted = 0, amountOfHabit = 0, date, ...rest }: Props) {
    const amountAccomplishedPercentage = amountOfHabit > 0 ? generateProgressPercentage(amountOfHabit, amountCompleted) : 0
    const today = dayjs().startOf('day').toDate()
    const isCurrent = dayjs(date).isSame(today)
    return (
        <TouchableOpacity
            className={clsx('rounded-lg border-2 m-1', {
                ['bg-zinc-900 border-zinc-800']: amountAccomplishedPercentage === 0,
                ['bg-green-900 border-green-700']: amountAccomplishedPercentage > 0 && amountAccomplishedPercentage < 20,
                ['bg-green-800 border-green-600']: amountAccomplishedPercentage >= 20 && amountAccomplishedPercentage < 40,
                ['bg-green-700 border-green-500']: amountAccomplishedPercentage >= 40 && amountAccomplishedPercentage < 60,
                ['bg-green-600 border-green-500']: amountAccomplishedPercentage >= 60 && amountAccomplishedPercentage < 80,
                ['bg-green-500 border-green-400']: amountAccomplishedPercentage >= 80,
                ["border-white border-4"]: isCurrent
            })}
            activeOpacity={0.7}
            style={{ width: daySize, height: daySize }} {...rest}
        />

    )
}