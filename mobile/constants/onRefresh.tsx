import {ImpactFeedbackStyle} from "expo-haptics/src/Haptics.types";
import * as Haptics from "expo-haptics";
import {useUser} from "@/components/UserProvider";

export const useRefresh = (setIsRefreshing) => {
    const {refreshUser} = useUser()

    return async () => {
        await Haptics.impactAsync(ImpactFeedbackStyle.Light)
        setIsRefreshing(true);
        await refreshUser();
        setIsRefreshing(false)
    };
}