import { View, Text } from "react-native";

export interface HeaderProps {
    title: string;
    align?: 'left' | 'center';
    small?: boolean;
}
export default function AppHeader({title, align, small}: HeaderProps){
    return (
        <>
            <View className={`pe-5 pt-3 pb-4 ${align === 'left' ? 'flex-1' : ''}`}>
                <Text className={`text-white ${small ? '' : 'font-semibold'}`} style={{
                    letterSpacing: 0.5, fontSize: small ? 16 : 26}}>{title}</Text>
            </View>
        </>
    )
}