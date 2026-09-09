import {TextInput, TextInputProps} from "react-native";

export default function AppTextInput({className = '', style, ...props}: TextInputProps){
    return (
        <TextInput
            className={`${className} text-white`}
            style={style}
            {...props}/>
    )
}
