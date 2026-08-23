import {TextProps, Text} from "react-native";
import { twMerge } from 'tailwind-merge'

export default function AppText({className = '', style, ...props}: TextProps){
    return (
        <Text
            className={twMerge("text-white text-base", className)}
            style={style}
            {...props}/>
    )
}