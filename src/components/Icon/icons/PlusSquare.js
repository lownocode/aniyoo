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
        viewBox="0 0 448 512"
        width={size}
        height={size}
        fill={color}
        >
            <Path d="M384 32H64C28.65 32 0 60.66 0 96v320c0 35.34 28.65 64 64 64h320c35.35 0 64-28.66 64-64V96c0-35.34-28.7-64-64-64zm-64.9 248h-72v72c0 13.2-10.8 24-23.1 24-13.2 0-24-10.8-24-24v-72h-72.9c-12.3 0-24-10.8-24-24s10.8-24 24-24h71.1v-72c0-13.2 10.8-24 24-24s23.1 10.8 23.1 24v72h72c13.2 0 23.1 10.8 23.1 24 2.7 13.2-7.2 24-21.3 24z"></Path>
        </Svg>
    );
}

export default Icon;