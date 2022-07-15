import React from "react";
import Svg, { Path, G } from "react-native-svg";

const Icon = (props) => {
    const {
        size = 15,
        color = "#fff"
    } = props;

    return (
        <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fillRule="evenodd"
        clipRule="evenodd"
        imageRendering="optimizeQuality"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
        viewBox="0 0 11.32 11.32"
        >
            <G>
                <Path fill="none" d="M0 0H11.32V11.32H0z"></Path>
                <Path fill={color} d="M5.66 8.08c-.67 0-1.27-.27-1.71-.71-.44-.43-.71-1.04-.71-1.71 0-.67.27-1.27.71-1.71.44-.44 1.04-.71 1.71-.71.67 0 1.28.27 1.71.71.44.44.71 1.04.71 1.71 0 .67-.27 1.28-.71 1.71-.43.44-1.04.71-1.71.71zm-1.45-.96c.37.37.88.6 1.45.6s1.08-.23 1.46-.6c.37-.38.6-.89.6-1.46s-.23-1.08-.6-1.45c-.38-.37-.89-.6-1.46-.6s-1.08.23-1.45.6c-.37.37-.6.88-.6 1.45s.23 1.08.6 1.46z"></Path>
                <Path fill={color} d="M5.66 8.08c-.45 0-.85-.28-1.14-.74-.26-.43-.43-1.03-.43-1.68 0-.65.17-1.24.43-1.68.29-.46.69-.74 1.14-.74.45 0 .86.28 1.14.74.27.44.43 1.03.43 1.68 0 .65-.16 1.25-.43 1.68-.28.46-.69.74-1.14.74zm-.82-.93c.21.35.51.57.82.57.32 0 .61-.22.83-.57.23-.38.38-.9.38-1.49 0-.58-.15-1.11-.38-1.48-.22-.36-.51-.57-.83-.57-.31 0-.61.21-.82.57-.24.37-.38.9-.38 1.48 0 .59.14 1.11.38 1.49z"></Path>
                <Path fill={color} d="M5.85 3.42L5.85 7.9 5.48 7.9 5.48 3.42z"></Path>
                <Path fill={color} d="M7.9 5.85L3.42 5.85 3.42 5.48 7.9 5.48z"></Path>
                <Path fill={color} d="M7.51 4.43c-.23.14-.51.25-.83.33a4.69 4.69 0 01-2.03 0c-.32-.08-.61-.19-.84-.33L4 4.12c.2.12.45.21.73.28a3.95 3.95 0 001.86 0c.29-.07.54-.16.73-.28l.19.31z"></Path>
                <Path fill={color} d="M8.12 4.55a.184.184 0 11.08-.36c.13.03.25.08.33.14.11.06.18.15.21.25.12.33-.15.74-.68 1.14-.48.36-1.18.73-2 1.03-.82.3-1.59.47-2.19.51-.67.03-1.14-.11-1.26-.44a.506.506 0 01-.01-.3c.02-.1.07-.2.15-.3.05-.08.17-.1.25-.04.08.05.1.17.04.25-.04.06-.07.12-.08.18-.01.03-.01.06 0 .09.05.16.39.22.89.19.56-.03 1.3-.19 2.09-.48.78-.29 1.45-.64 1.9-.98.4-.3.62-.57.56-.72-.01-.03-.03-.05-.07-.08a.71.71 0 00-.21-.08z"></Path>
            </G>
        </Svg>
    );
}

export default Icon;