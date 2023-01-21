import { useNavigation } from "@react-navigation/native";
import { View, Text, ScrollView, Alert } from "react-native";
import { HabitDay, daySize } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { generateDatesFromYearBeginning } from '../utils/generate-dates-from-year-begining'
import { api } from '../lib/axios'
import { useState, useEffect } from "react";
import dayjs from "dayjs";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const datesFromyearStart = generateDatesFromYearBeginning()
const minimumSummaryDatesSizes = 18 * 5
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromyearStart.length

type SummaryProps = Array<{
    id: string;
    date: string;
    amount: number
    completed: number
}>

export function Home() {
    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState<SummaryProps | null>(null)
    const { navigate } = useNavigation()
    async function fetchData() {
        try {
            setLoading(true)
            const res = await api.get('summary')
            setSummary(res.data)
        } catch (error) {
            Alert.alert('Ops', 'Não foi possivel carregar o sumário de hábitos.')
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])
    if (loading) {
        return (
            <Loading />
        )
    }
    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <Header />
            <View className="flex-row mt-6 mb-2">
                {
                    weekDays.map((weekDay, i) => (
                        <Text style={{ width: daySize }} className="text-zinc-400 text-xl font-bold text-center mx-1" key={`${weekDay}-${i}`}>
                            {weekDay}
                        </Text>
                    ))
                }
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {
                    summary &&
                    <View className="flex-row flex-wrap">
                        {

                            datesFromyearStart.map(date => {
                                const dayWithHabits = summary.find(day => {
                                    return dayjs(date).isSame(day.date, 'day')
                                })
                                return (
                                    <HabitDay
                                        date={date}
                                        amountOfHabit={dayWithHabits?.amount}
                                        amountCompleted={dayWithHabits?.completed}
                                        onPress={() => navigate('habit', { date: date.toISOString() })}
                                        key={date.toISOString()} />
                                )
                            })
                        }
                        {
                            amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => {
                                return (
                                    <View key={i} className='opacity-40 bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800' style={{ width: daySize, height: daySize }} />
                                )
                            })
                        }
                    </View>
                }
            </ScrollView>

        </View>
    )
}