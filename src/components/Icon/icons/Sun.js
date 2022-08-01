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
        x="0"
        y="0"
        enableBackground="new 0 0 22.006 22.006"
        version="1.1"
        viewBox="0 0 22.006 22.006"
        xmlSpace="preserve"
        fill={color}
        width={size}
        height={size}
        >
            <Path
            d="M4.63 6.045A1 1 0 106.044 4.63l-1.4-1.4A1.001 1.001 0 103.23 4.644l1.4 1.401zM20.997 10.003h-1.98a.999.999 0 100 2h1.98a1 1 0 100-2zM4 11.003a1 1 0 00-1.01-1H1.009c-.558 0-1.009.444-1.009 1 0 .553.443 1 1.009 1H2.99c.558 0 1.01-.443 1.01-1zM11.003 5a6 6 0 000 12c3.312 0 6-2.687 6-6s-2.688-6-6-6zm0 10a4 4 0 110-8 4 4 0 010 8zM4.63 15.962l-1.4 1.4a1 1 0 101.414 1.414l1.4-1.4a1.001 1.001 0 10-1.414-1.414zM17.376 6.045l1.4-1.401a1 1 0 10-1.414-1.414l-1.4 1.4a1.002 1.002 0 00-.007 1.421c.392.39 1.021.393 1.421-.006zM11.003 18.006a1 1 0 00-1 1.011v1.98a1.001 1.001 0 102 0v-1.98c0-.559-.443-1.011-1-1.011zM17.376 15.962a1 1 0 10-1.414 1.414l1.4 1.4a1.003 1.003 0 001.421.007.998.998 0 00-.007-1.421l-1.4-1.4zM11.003 4c.553 0 1-.443 1-1.01V1.01a1 1 0 10-2 0v1.98c0 .558.444 1.01 1 1.01z"
            ></Path>
        </Svg>
    );
}

export default Icon;