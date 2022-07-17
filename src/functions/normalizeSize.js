import { Dimensions, PixelRatio } from "react-native";

const { width } = Dimensions.get("window");

const scale = width / 320;

export const normalizeSize = (size) => {
    const newSize = size * scale;

    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
}