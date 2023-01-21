import { useState, useEffect } from "react";
import { ScrollView, View, Text, Alert } from "react-native";
import { useRoute } from '@react-navigation/native'
import { generateProgressPercentage } from '../utils/genarate-progress-percentage'
import { BackButton } from "../components/BackButton";
import dayjs from 'dayjs'
import { ProgressBar } from "../components/ProgressBar";
import { CheckBox } from "../components/CheckBox";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { HabitsEmpty } from "../components/HabitsEmpty";
interface Params {
    date: string
}
interface DayInfoProps {
    completedHabit: string[]
    possibleHabits: {
        id: string
        title: string
    }[]
}
export function Habit() {
    const [loading, setLoading] = useState(true)
    const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null)
    const [completedHabits, setCompletedHabits] = useState<string[]>([])

    const route = useRoute()
    const { date } = route.params as Params
    const parsedDate = dayjs(date)
    const dayofWeek = parsedDate.format('dddd')
    const dayAndMonth = parsedDate.format('DD/MM')

    const habitsProgress = dayInfo?.possibleHabits.length ? generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length) : 0

    async function fetchHabits() {
        try {
            setLoading(true)
            const res = await api.get('/day', {
                params: {
                    date
                }
            })
            setDayInfo(res.data)
            setCompletedHabits(res.data.completedHabits)
        } catch (error) {
            console.log(error)
            Alert.alert('Ops', 'Não foi possivel carregar as informações dos hábitos')
        } finally {
            setLoading(false)
        }
    }
    async function handleToggleHabit(habitId: string) {
        if (completedHabits.includes(habitId)) {
            setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId))
        } else {
            setCompletedHabits(prevState => [...prevState, habitId])
        }
    }
    useEffect(() => {
        fetchHabits()
    }, [])
    if (loading) {
        return (
            <Loading />
        )
    }
    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <BackButton />
                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayofWeek}
                </Text>
                <Text className="text-white font-extrabold text-3xl">
                    {dayAndMonth}
                </Text>
                <ProgressBar progress={habitsProgress} />
                <View className="mt-6">
                    {
                        dayInfo?.possibleHabits ?
                            dayInfo?.possibleHabits.map((habit) => {
                                return (
                                    <CheckBox key={habit.id} title={habit.title} checked={completedHabits.includes(habit.id)} onPress={() => handleToggleHabit(habit.id)} />
                                )
                            }) : <HabitsEmpty />
                    }

                </View>
            </ScrollView>
        </View>
    )
}