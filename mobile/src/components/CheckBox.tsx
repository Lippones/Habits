import { TouchableOpacity, View, Text, TouchableOpacityProps } from 'react-native'
import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors'
import Animated,{ZoomIn, ZoomOut} from 'react-native-reanimated'
interface Props extends TouchableOpacityProps {
    title: string
    checked?: boolean
}
export function CheckBox({ checked = false, title, ...rest }: Props) {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row mb-3 items-center"
            {...rest}
        >
            {checked ? <Animated.View exiting={ZoomOut} entering={ZoomIn} className='h-8 w-8 bg-green-500 rounded-lg items-center justify-center'>
                <Feather
                    name='check'
                    size={20}
                    color={colors.white}
                />
            </Animated.View> : <View className='h-8 w-8 bg-zinc-900 rounded-lg' />}

            <Text className='text-white font-semibold text-base ml-3'>
                {title}
            </Text>

        </TouchableOpacity>
    )
}