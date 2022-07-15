import React, { useContext } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import ThemeContext from "../../config/ThemeContext";

import { 
    Header,
} from "../../components";

export const EditProfileSecurity = (props) => {
    const theme = useContext(ThemeContext);

    const { 
        navigation: {
            goBack,
        }
    } = props;

    return (
        <GestureHandlerRootView style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Редактировать профиль"
            subtitle="Безопасность"
            height={30}
            backButtonOnPress={() => goBack()}
            backButton
            />
        </GestureHandlerRootView>
    )
};