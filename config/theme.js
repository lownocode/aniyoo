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
        //components
        press_icon_background: "rgba(0, 0, 0, 0.1)",
        snackbar_background: "#0077ff",
        header_background: "#f0f6ff",
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
            placeholder: "#gray"
        },
        placeholder: {
            title: "#000000",
            subtitle: "gray"
        },
        bottom_tabbar: {
            background: "#ffffff",
            active_tab_background: palette.accent + "19",
            active_icon_color: palette.accent
        },
        switch: {
            track_off: "#d4d4d4",
            track_on: palette.accent + "50",
            thumb: palette.accent,
            thumb_light: "#f0f0f0"
        }
    },

    DARK: {
        background_content: "#141414",
        divider_color: "#2A2A2A",
        activity_indicator_color: "#ffffff",
        accent: palette.accent,
        text_color: "#ffffff",
        text_secondary_color: "#b8b8b8",
        refresh_control_background: "#1c1c1c",
        //components
        press_icon_background: "rgba(255, 255, 255, 0.1)",
        snackbar_background: "#383838",
        header_background: "#1a1a1a",
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
            background: "#21212130",
            border: "#2A2A2A",
            placeholder: "#gray"
        },
        placeholder: {
            title: "#ffffff",
            subtitle: "gray"
        },
        bottom_tabbar: {
            background: "#212121",
            active_tab_background: "rgba(255, 255, 255, .19)",
            active_icon_color: "#ffffff"
        },
        switch: {
            track_off: "gray",
            track_on: "gray",
            thumb: "#ffffff",
            thumb_light: "#ffffff"
        }
    }
};

export default theme;