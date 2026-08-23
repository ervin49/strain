import {Pressable, Text} from "react-native";
import {ReactNode} from "react";

interface ButtonProps{
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary'
    children?: ReactNode;
    disabled?: boolean;
    className?: string;
}
export default function AppButton({
                                   title,
                                   onPress,
                                   variant = 'primary',
                                   children,
    disabled = false,
                                   className = ''
                               } : ButtonProps){
    const bgStyle = variant === 'primary' ? 'bg-[#0189F9]' : 'bg-white';
    const textStyle = variant === 'primary' ? 'text-white' : 'text-gray';
    return (
        <Pressable
            onPress={onPress}
            className={`w-full py-3 justify-center items-center active:opacity-80 ${bgStyle} rounded-xl ${className} ${disabled ? 'bg-gray-500' : ''}`}
            disabled={disabled}>
            <Text className={`font-semibold text-lg ${textStyle}`}>{title}</Text>
            {children}
        </Pressable>
    )
}