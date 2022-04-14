import React, {Fragment} from 'react';
import { View, Text, StyleSheet, StatusBar, } from 'react-native';
import { Icon, PressIcon } from '.';

export const Header = (props) => {
    const {
        backgroundColor,
        backButton,
        title,
        titleStyle,
        subtitleStyle,
        subtitle,
        backButtonOnPress,
        style,
        afterComponent
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
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15
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
            fontSize: 22,
            fontWeight: "500",
            color: style.text_color,
            marginLeft: backButton ? 0 : 25,
        },
        subtitle: {
            color: 'gray',
            fontSize: 15,
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
                <Text style={[styles.title, titleStyle]}>
                    {title}
                </Text>

                {
                    subtitle &&
                    <Text style={[styles.subtitle, subtitleStyle]}>
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
                        style={style}
                        icon={
                            <Icon
                            type="AntDesign"
                            name="arrowleft"
                            color="gray"
                            size={22}
                            />
                        }
                        onPress={backButtonOnPress}
                        containerStyle={{
                            marginHorizontal: 17,
                        }}
                        />}
                        {renderTitle()}
                    </View>

                    <View style={styles.after}>
                        {afterComponent}
                    </View>
                </View>
            </Fragment>
        );
};