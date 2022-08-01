import React, { Fragment, useContext } from 'react';
import { View, StyleSheet, StatusBar, } from 'react-native';

import { Icon, PressIcon, Divider, Text } from ".";

import ThemeContext from "../config/ThemeContext";

export const Header = (props) => {
    const theme = useContext(ThemeContext);
    const {
        backgroundColor = theme.header_background,
        backButton,
        title,
        titleStyle,
        subtitleStyle,
        subtitle,
        backButtonOnPress,
        afterComponent,
        divider = true
    } = props;

    const statusBarHeight = StatusBar.currentHeight;

    const styles = StyleSheet.create({
        header: {
            flexDirection: 'row',
            alignItems: "center",
            paddingTop: statusBarHeight + 20,
            paddingBottom: 10,
            justifyContent: "space-between",
            zIndex: 100,
        },
        leftHeader: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        back: {
            color: '#5F5F5F',
            marginTop: 3,
        },
        title: {
            fontSize: 18,
            fontWeight: "500",
            color: theme.text_color,
            marginLeft: backButton ? 0 : 25,
        },
        subtitle: {
            color: 'gray',
            fontSize: 14,
            fontWeight: "400",
            marginLeft: backButton ? 0 : 25,
            marginTop: -2
        },
        after: {
            marginRight: 25,
        }
    });

    const renderTitle = () => {
        return (
            <View>
                <Text 
                style={{...styles.title, ...titleStyle}}
                numberOfLines={1}
                >
                    {title}
                </Text>

                {
                    subtitle &&
                    <Text 
                    style={[styles.subtitle, subtitleStyle]}
                    numberOfLines={1}
                    >
                        {subtitle}
                    </Text>
                }
            </View>
        );
    };

        return (
            <Fragment>
                <View
                    style={[
                        {
                            backgroundColor: backgroundColor, 
                        },
                        styles.header,
                    ]}
                >
                    <View style={styles.leftHeader}>
                        {backButton && 
                        <PressIcon 
                        icon={
                            <Icon
                            name="arrow-back"
                            color={theme.text_color}
                            />
                        }
                        onPress={backButtonOnPress}
                        containerStyle={{
                            marginHorizontal: 17,
                        }}
                        />}
                        {renderTitle()}
                    </View>

                    {
                        afterComponent && (
                            <View style={styles.after}>
                                {afterComponent}
                            </View>
                        )
                    }
                </View>

                {
                    divider && <Divider />
                }
            </Fragment>
        );
};