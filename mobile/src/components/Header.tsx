import { TouchableOpacity, View, Text } from "react-native";
import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors'
import { useNavigation } from '@react-navigation/native'
export function Header() {
    const { navigate } = useNavigation()
    return (
        <View className="w-full flex-row items-center justify-between">
            <Text>
                Hábitos
            </Text>
            <TouchableOpacity onPress={() => navigate('new')} activeOpacity={0.7} className="flex-row h-11 px-4 border border-green-500 rounded-lg items-center">
                <Feather
                    name="plus"
                    color={colors.green[500]}
                    size={20} />
                <Text className="text-white ml-3 font-semibold text-base">Novo</Text>
            </TouchableOpacity>
        </View>
    )
}