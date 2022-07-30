import React, { useContext } from "react";

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
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Редактировать профиль"
            subtitle="Безопасность"
            height={30}
            backButtonOnPress={() => goBack()}
            backButton
            />
        </View>
    )
};