import React from "react";
import Svg, { Path } from "react-native-svg";

const Icon = (props) => {
    const {
        size = 15,
        color = "#fff"
    } = props;

    return (
        <Svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 512 512"
        xmlSpace="preserve"
        fill={color}
        width={size}
        height={size}
        >
            <Path d="M505 257c0 34.8-.7 69.7.2 104.5 1.5 61.6-37.2 109.2-86.5 130.4-19.8 8.5-40.6 13-62.1 13-67.3.1-134.7 1-202-.3-50.7-1-92.4-22.2-122.3-64-15.7-22-23.2-47-23.2-74.1v-215c0-58.5 28.5-99.4 79.1-126C110.2 14 134.1 9.1 159 9c65.3 0 130.7-.4 196 .2 50.7.4 93 19.8 124.2 60.6 17.4 22.8 25.8 49 25.8 77.8V257zm-459 0v110c0 16.4 3.8 31.8 12.3 45.7 22.3 36.5 56 54.3 97.8 55 67.1 1 134.3.4 201.5.2 16.5 0 32.5-3.4 47.4-10.5 40.6-19.4 63.3-50.3 63.1-96.7-.4-71-.1-142-.1-213 0-20.1-5.7-38.5-17.6-54.7-23-31.1-54.8-46.4-92.8-46.8-67-.8-134-.3-201-.2-14.3 0-28.1 2.9-41.5 7.9-36.8 13.7-71 48.4-69.4 99.5 1.2 34.6.3 69.1.3 103.6z"></Path>
            <Path d="M257.6 363c-64.5 0-116.5-51.4-116.6-115.4-.1-63 52.3-114.6 116.4-114.6 64.3-.1 116.5 51.4 116.6 114.9 0 63.4-52.1 115-116.4 115.1zm0-37c43.9 0 79.5-35.1 79.4-78.3-.1-42.8-35.7-77.8-79.4-77.8-43.9 0-79.7 34.9-79.7 78 .1 43.2 35.8 78.2 79.7 78.1zM387.5 98c13.5 0 24.5 11.5 24.5 25.6-.1 14.1-11.2 25.5-24.7 25.4-13.3-.1-24.2-11.5-24.2-25.3C363 109.6 374 98 387.5 98z"></Path>
        </Svg>
    );
}

export default Icon;