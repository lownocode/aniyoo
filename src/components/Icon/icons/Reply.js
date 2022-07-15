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
        width={size}
        height={size}
        fill="none"
        viewBox="0 0 24 24"
        >
            <Path
            fill={color}
            d="M13.277 16.221a.75.75 0 01-1.061 1.06l-4.997-5.003a.75.75 0 010-1.06l4.997-4.998a.75.75 0 011.061 1.06L9.557 11h3.842c1.595 0 2.81.242 3.889.764l.246.126a6.203 6.203 0 012.576 2.576c.61 1.14.89 2.418.89 4.135a.75.75 0 01-1.5 0c0-1.484-.228-2.52-.713-3.428a4.702 4.702 0 00-1.96-1.96c-.838-.448-1.786-.676-3.094-.709L13.4 12.5H9.562l3.715 3.721zm-4-10.001a.75.75 0 010 1.06L4.81 11.748l4.467 4.473a.75.75 0 01-1.061 1.06l-4.997-5.003a.75.75 0 010-1.06L8.217 6.22a.75.75 0 011.06 0z"
            ></Path>
        </Svg>
    );
}

export default Icon;