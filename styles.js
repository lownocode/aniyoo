import { Dimensions } from "react-native";

const accent = "#4f90ff";
const dark_secondary = "#383838";

export const style = (darkThemeMode) => {
    const view = {
        flex: 1,
        backgroundColor: darkThemeMode ? "#141414" : "white",
        zIndex: 0
    },
    overlay = {
        padding: 0,
        backgroundColor: darkThemeMode ? "#212125" : "white",
        borderRadius: 10,
        width: Dimensions.get('window').width - 30,
    };

    const background_content = darkThemeMode ? "#141414" : "white";
    const input_icon_color = "gray";
    const refresh_control_background_color = darkThemeMode ? '#1c1c1c' : "white";
    const icon_color = darkThemeMode ? "#969696" : "#757575";
    const text_color = darkThemeMode ? "#fff" : "#000";
    const text_secondary_color = darkThemeMode ? "#b8b8b8" : "#666666";
    const tab_bar_active_text_color = darkThemeMode ? "white" : accent;
    const tab_bar_inactive_text_color = "gray"
    const bottom_tab_bar_active_tint_color = darkThemeMode ? 'white' : accent;
    const status_bar_background = darkThemeMode ? "#141414" : "white";
    const image_placeholder_background_color = darkThemeMode ? "#808080" : accent;
    const activity_indicator_color = darkThemeMode ? "white" : "#000";
    const divider_color = darkThemeMode ? '#2A2A2A' : "#d9d9d9";

    //Placeholder
    const placeholder_title_color = darkThemeMode ? "white" : "#000";
    const placeholder_subtitle_color = darkThemeMode ? "gray" : "gray";

    //Button
    const button_primary_background = darkThemeMode ? "#303030" : accent + "30";
    const button_primary_text_color = darkThemeMode ? "#d1d1d1" : accent;
    const button_primary_press_background = darkThemeMode ? "#969696" : accent + "30";

    const button_outline_background = darkThemeMode ? "#303030" : accent;
    const button_outline_text_color = darkThemeMode ? "white" : accent;
    const button_outline_press_background = darkThemeMode ? "#303030" : accent + "30";

    const button_tertiary_background = darkThemeMode ? "#1a1a1a" : "#fafafa";
    const button_tertiary_text_color = darkThemeMode ? "#b8b8b8" : "#737373";
    const button_tertiary_press_background = darkThemeMode ? "#4f4f4f" : "#edebeb";

    const button_overlay_background = "transparent";
    const button_overlay_text_color = darkThemeMode ? "#b8b8b8" : accent;
    const button_overlay_press_background = darkThemeMode ? "#303030" : accent + "30";

    //other variables
    const date_time_picker_display = darkThemeMode ? "" : "calendar";

    //header
    const header_background_color = darkThemeMode ? '#1a1a1a' : "#f0f6ff";

    //footer
    const text_footer_color = darkThemeMode ? "#b8b8b8" : "#737373";

    //switch
    const switch_track_color_off = darkThemeMode ? "gray" : "#d4d4d4";
    const switch_track_color_on = darkThemeMode ? "gray" : accent + "50";
    const switch_thumb_color = darkThemeMode ? "white" : accent;
    const switch_thumb_color_light = darkThemeMode ? "white" : "#f0f0f0";
    
    //PressIcon
    const press_icon_background = darkThemeMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

    //Cell
    const cell_title_color = darkThemeMode ? "#fff" : "#000";
    const cell_subtitle_color = darkThemeMode ? "gray" : "gray";
    const cell_press_background = darkThemeMode ? "rgba(255, 255, 255, 0.09)" : "rgba(0, 0, 0, 0.1)";

    //Overlay
    const overlay_background = darkThemeMode ? "#212125" : "white";

    //Authorization
    const authorization_card_background = darkThemeMode ? "#212125" : accent + "10";

    //Input
    const input_background = darkThemeMode ? "#21212130" : "#21212110";
    const input_border_color = darkThemeMode ? '#2A2A2A' : "#d9d9d9";
    const input_placeholder_text_color = darkThemeMode ? "gray" : "gray";

    //Bottom tabs
    const bottom_tab_background_color = darkThemeMode ? '#212121' : "white";
    const bottom_tab_bar_active_tab_background = darkThemeMode ? "rgba(255, 255, 255, .19)" : accent + "19";
    const bottom_tab_active_color = darkThemeMode ? "white" : accent;
    const bottom_tab_border_width = darkThemeMode ? 0 : 0.4;

    //Sbackbar
    const snackbar_background = darkThemeMode ? "#383838" : "#0077ff";

    //BottomModal 
    const bottom_modal_background = darkThemeMode ? "#1f1f1f" : "#f7f7f7";
    const bottom_modal_border_color = darkThemeMode ? "#363636" : "#d6d6d6";

    return {
        dark_secondary,
        bottom_modal_border_color,
        bottom_modal_background,
        snackbar_background,
        bottom_tab_border_width,
        bottom_tab_active_color,
        bottom_tab_bar_active_tab_background,
        bottom_tab_background_color,
        input_border_color,
        input_background,
        authorization_card_background,
        accent,
        overlay_background,
        cell_press_background,
        cell_subtitle_color,
        cell_title_color,
        press_icon_background,
        button_overlay_press_background,
        button_tertiary_press_background,
        button_outline_press_background,
        button_primary_press_background,
        background_content,
        text_footer_color,
        header_background_color,
        date_time_picker_display,
        button_overlay_text_color,
        button_overlay_background,
        button_tertiary_background,
        button_tertiary_text_color,
        button_outline_text_color,
        button_outline_background,
        button_primary_text_color,
        button_primary_background,
        placeholder_subtitle_color,
        placeholder_title_color,
        view,
        overlay,
        input_placeholder_text_color,
        input_icon_color,
        refresh_control_background_color,
        icon_color,
        text_color,
        tab_bar_active_text_color,
        tab_bar_inactive_text_color,
        bottom_tab_bar_active_tint_color,
        text_secondary_color,
        status_bar_background,
        image_placeholder_background_color,
        activity_indicator_color,
        divider_color,
        switch_track_color_off,
        switch_track_color_on,
        switch_thumb_color,
        switch_thumb_color_light,
    };
};