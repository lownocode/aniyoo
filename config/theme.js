const palette = {
    accent: "#4f90ff"
};

const theme = {
    LIGHT: {
        background_content: "#ffffff",
        divider_color: "#d9d9d9",
        activity_indicator_color: "#000000",
        accent: palette.accent,
        text_color: "#000000",
        text_secondary_color: "#666666",
        refresh_control_background: "#ffffff",
        incomplete_text_secondary_color: "#c2c2c2",

        //components

        press_icon_background: "rgba(0, 0, 0, 0.1)",
        snackbar_background: "#0077ff",
        header_background: "#ffffff",
        profile_header_background: "#f0f6ff",
        icon_color: "#757575",
        cell: {
            title_color: "#000000",
            subtitle_color: "gray",
            press_background: "rgba(0, 0, 0, 0.1)"
        },
        bottom_modal: {
            background: "#f7f7f7",
            border: "#d6d6d6"
        },
        button: {
            primary: {
                background: palette.accent + "30",
                text_color: palette.accent,
                press_background: palette.accent + "30",
            },
            outline: {
                background: palette.accent,
                text_color: palette.accent,
                press_background: palette.accent + "30",
            },
            tertiary: {
                background: "#fafafa",
                text_color: "#737373",
                press_background: "#edebeb"
            },
            overlay: {
                background: "transparent",
                text_color: palette.accent,
                press_background: palette.accent + "30",
            },
        },
        input: {
            background: "#21212110",
            border: "#d9d9d9",
            placeholder: "gray"
        },
        placeholder: {
            title: "#000000",
            subtitle: "gray"
        },
        bottom_tabbar: {
            background: "#ffffff",
            active_tab_background: palette.accent + "19",
            active_icon_color: palette.accent,
            border_color: palette.accent + "29"
        },
        switch: {
            track_off: "#d4d4d4",
            track_on: palette.accent + "50",
            thumb: palette.accent,
            thumb_light: "#f0f0f0"
        },
        donut_chart: {
            color: palette.accent
        },
        progress: {
            background: palette.accent
        },

        //panels

        anime: {
            back_button_background: "rgba(0, 0, 0, 0.1)",
            button_start_watch_background: "#546161",
            button_start_watch_text_color: "#fff",
            //lists
            watching: "#34c759",
            completed: "#5856d6",
            planned: "#af52de",
            postponed: "#ff9500",
            dropped: "#ff453a",
            none: "#2A2A2A"
        },
    },

    DARK: {
        background_content: "#141414",
        divider_color: "#2A2A2A",
        activity_indicator_color: "#ffffff",
        accent: palette.accent,
        text_color: "#ffffff",
        text_secondary_color: "#b8b8b8",
        refresh_control_background: "#1c1c1c",
        incomplete_text_secondary_color: "#c2c2c2",

        //components

        press_icon_background: "rgba(255, 255, 255, 0.1)",
        snackbar_background: "#383838",
        header_background: "#141414",
        profile_header_background: "#1a1a1a",
        icon_color: "#969696",
        cell: {
            title_color: "#ffffff",
            subtitle_color: "gray",
            press_background: "rgba(255, 255, 255, 0.09)"
        },
        bottom_modal: {
            background: "#1f1f1f",
            border: "#363636"
        },
        button: {
            primary: {
                background: "#303030",
                text_color: "#d1d1d1",
                press_background: "#969696"
            },
            outline: {
                background: "#303030",
                text_color: "#ffffff",
                press_background: "#303030"
            },
            tertiary: {
                background: "#1a1a1a",
                text_color: "#b8b8b8",
                press_background: "#4f4f4f"
            },
            overlay: {
                background: "transparent",
                text_color: "#b8b8b8",
                press_background: "#303030"
            },
        },
        input: {
            background: "#212121",
            border: "#2A2A2A",
            placeholder: "gray"
        },
        placeholder: {
            title: "#ffffff",
            subtitle: "gray"
        },
        bottom_tabbar: {
            background: "#212121",
            active_tab_background: "rgba(255, 255, 255, .19)",
            active_icon_color: "#ffffff",
            border_color: "#2A2A2A"
        },
        switch: {
            track_off: "gray",
            track_on: "gray",
            thumb: "#ffffff",
            thumb_light: "#ffffff"
        },
        donut_chart: {
            color: "#ffffff"
        },
        progress: {
            background: "#ffffff"
        },

        //panels

        anime: {
            back_button_background: "#1f1f1f",
            button_start_watch_background: "#546161",
            button_start_watch_text_color: "#fff",
            //lists
            watching: "#34c759",
            completed: "#5856d6",
            planned: "#af52de",
            postponed: "#ff9500",
            dropped: "#ff453a",
            none: "#323232"
        },
        anime_mark: {
            "1": "#f52105",
            "2": "#f58d05",
            "3": "#f1f505",
            "4": "#90fc03",
            "5": "#30fc03",
        }
    }
};

export default theme;