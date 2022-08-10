import React from "react";
import { useSelector } from "react-redux";

import { 
    Header,
} from "../../components";

export const EditProfileSecurity = (props) => {
    const { theme: { theme } } = useSelector(state => state);

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