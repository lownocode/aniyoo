import React from "react";

import { 
    Panel,
} from "../../components";

export const EditProfileSecurity = (props) => {
    const { 
        navigation: {
            goBack,
        }
    } = props;

    return (
        <Panel
        headerProps={{
            title: "Редактировать профиль",
            subtitle: "Безопасность",
            backOnPress: () => goBack()
        }}
        >
        </Panel>
    )
};