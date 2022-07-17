import React from "react";
import Svg, { Path, Defs, Use } from "react-native-svg";

const Icon = (props) => {
    const {
        size = 15,
    } = props;

    return (
        <Svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width={size}
        height={size}
        viewBox="0 0 30 20"
        >
            <Defs>
                <Path
                id="s"
                fill="#FF0"
                d="M0-1L.588.809-.952-.309H.952L-.588.809z"
                ></Path>
            </Defs>
            <Path fill="#EE1C25" d="M0 0H30V20H0z"></Path>
            <Use transform="matrix(3 0 0 3 5 5)" xlinkHref="#s"></Use>
            <Use transform="rotate(23.036 .093 25.536)" xlinkHref="#s"></Use>
            <Use transform="rotate(45.87 1.273 16.18)" xlinkHref="#s"></Use>
            <Use transform="rotate(69.945 .996 12.078)" xlinkHref="#s"></Use>
            <Use transform="rotate(20.66 -19.689 31.932)" xlinkHref="#s"></Use>
        </Svg>
    );
}

export default Icon;