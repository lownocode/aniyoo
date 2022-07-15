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
            d="M18.25 3A2.75 2.75 0 0121 5.75v12.3a2.5 2.5 0 00-1.5.95 2.496 2.496 0 00-2-1c-.818 0-1.544.393-2 1a2.5 2.5 0 00-4.45 2h-5.3A2.75 2.75 0 013 18.25V5.75A2.75 2.75 0 015.75 3h12.5zM15 12.25a.75.75 0 00-.75-.75h-7.5l-.102.007A.75.75 0 006.75 13h7.5l.102-.007A.75.75 0 0015 12.25zm2.25 3.25H6.75l-.102.007A.75.75 0 006.75 17h10.5l.102-.007a.75.75 0 00-.102-1.493zM18 8.25a.75.75 0 00-.75-.75H6.75l-.102.007A.75.75 0 006.75 9h10.5l.102-.007A.75.75 0 0018 8.25zM13.5 22a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm4 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5.5-1.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
            ></Path>
        </Svg>
    );
}

export default Icon;