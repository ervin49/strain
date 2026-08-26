import AppHeader, {HeaderProps} from "@/components/AppHeader";

export const createScreenOptions = ({title, align = 'center', small = true}: HeaderProps) => ({
    headerShown: true,
    headerTitle: () => (
        <AppHeader title={title} align={align} small={small}></AppHeader>
    ),
    headerTintColor: "lightgray",
    headerStyle: {
        backgroundColor: "black"
    },
});