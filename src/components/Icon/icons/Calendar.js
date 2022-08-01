import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

const Icon = (props) => {
    const {
        size = 15,
        color = "#fff"
    } = props;

    return (
        <Svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={color}
        >
            <Path d="M14.75 3.25V3a.75.75 0 011.5 0v.25H17A4.75 4.75 0 0121.75 8v9A4.75 4.75 0 0117 21.75H7A4.75 4.75 0 012.25 17V8A4.75 4.75 0 017 3.25h.75V3a.75.75 0 011.5 0v.25h5.5zm5.5 7H3.75V17A3.247 3.247 0 007 20.25h10A3.247 3.247 0 0020.25 17v-6.75zm-12.5-5.5H7A3.247 3.247 0 003.75 8v.75h16.5V8A3.247 3.247 0 0017 4.75h-.75V5a.75.75 0 01-1.5 0v-.25h-5.5V5a.75.75 0 01-1.5 0v-.25z"></Path>
            <Circle cx="6.75" cy="13.25" r="0.75"></Circle>
            <Circle cx="6.75" cy="16.75" r="0.75"></Circle>
            <Circle cx="10.25" cy="13.25" r="0.75"></Circle>
            <Circle cx="10.25" cy="16.75" r="0.75"></Circle>
            <Circle cx="13.75" cy="13.25" r="0.75"></Circle>
            <Circle cx="13.75" cy="16.75" r="0.75"></Circle>
            <Circle cx="17.25" cy="13.25" r="0.75"></Circle>
            <Circle cx="17.25" cy="16.75" r="0.75"></Circle>
        </Svg>
    );
}

export default Icon;