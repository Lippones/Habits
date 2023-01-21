import { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { BackButton } from "../components/BackButton";
import { CheckBox } from "../components/CheckBox";
import colors from 'tailwindcss/colors'

import { Feather } from '@expo/vector-icons'
import { api } from "../lib/axios";

const avaliableWeekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']

export function New() {
    async function handleCreateNewhabit() {
        try {
            if (!title.trim() || weekDays.length === 0) {
                return Alert.alert('Novo hábito', 'Informe o nome do hábito e escolha a periodicidade')

            }
            const res = await api.post('/habits', {
                title,
                weekDays
            })
            setTitle('')
            setWeekDays([])
            Alert.alert('Novo hábito', 'Hábito criado com sucesso!')
        } catch (error) {
            console.log(error)
            Alert.alert('Ops', 'Não foi possivel criar o novo hábito')
        }
    }


    const [title, setTitle] = useState('')
    const [weekDays, setWeekDays] = useState<number[]>([])
    function handleToggleWeekDay(weekDayIndex: number) {
        if (weekDays.includes(weekDayIndex)) {
            setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex))
        } else {
            setWeekDays(prevState => [...prevState, weekDayIndex])
        }
    }
    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}>
                <BackButton />
                <Text className="mt-6 text-white font-extrabold text-3xl">
                    Criar hábito
                </Text>
                <Text className="mt-6 text-white font-semibold text-base">
                    Qual seu comprometimento?
                </Text>
                <TextInput
                    placeholder="Exercícios, dormir bem, etc..."
                    placeholderTextColor={colors.zinc[400]}
                    className="mt-3 h-12 pl-4 rounded-lg bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
                    onChangeText={text => setTitle(text)}
                    value={title}
                />
                <Text className="font-semibold mt-4 text-white mb-3 text-base">
                    Qual a recorrência?
                </Text>
                {
                    avaliableWeekDays.map((weekDay, index) => {
                        return (
                            <CheckBox onPress={() => handleToggleWeekDay(index)} checked={weekDays.includes(index)} key={index} title={weekDay} />
                        )
                    })
                }
                <TouchableOpacity
                    className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
                    activeOpacity={0.7}
                    onPress={() => handleCreateNewhabit()}
                >
                    <Feather
                        name="check"
                        size={20}
                        color={colors.white}
                    />
                    <Text className="font-semibold text-base text-white ml-2">
                        Confirmar
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    )
}