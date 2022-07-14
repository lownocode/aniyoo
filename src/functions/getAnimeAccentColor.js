import { detectColorLuma, lightenDarkenColor } from ".";

export const getAnimeAccentColor = (dominant, theme) => {
    const luma = detectColorLuma(dominant);

    if(luma < 80 && theme === "dark") {
        return lightenDarkenColor(dominant, 80);
    }
    else if(luma > 80 && theme === "light") {
        return lightenDarkenColor(dominant, -80);
    }

    return dominant;
};