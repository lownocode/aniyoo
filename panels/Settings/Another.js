import React from "react";
import { ScrollView, View, Switch } from "react-native";

import { 
    Header,
    Cell,
    Icon
} from "../../components";

export const Settings_Another = (props) => {
    const { 
        style,
        navigation: {
            goBack
        }
    } = props;

    return (
        <View style={style.view}>
            <Header
            title="Настройки"
            subtitle="Другое"
            height={30}
            backgroundColor={style.header_background_color}
            backButtonOnPress={() => goBack()}
            backButton
            style={style}
            />

            <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginTop: -15 }}
            >
                <View style={{marginTop: 5, paddingTop: 15}}/>
            </ScrollView>
        </View>
    )
};