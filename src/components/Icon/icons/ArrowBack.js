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
        data-name="Layer 2"
        viewBox="0 0 16 16"
        width={size}
        height={size}
        fill={color}
        >
            <Path d="M12.299.6a.5.5 0 00-.568-.021l-11 7a.5.5 0 000 .843l11 7A.504.504 0 0012 15.5a.501.501 0 00.481-.638L10.52 8l1.961-6.862A.5.5 0 0012.299.6zm-2.78 7.262a.51.51 0 000 .276l1.639 5.733L1.93 8l9.227-5.871z"></Path>
            <Path d="M15.137.52a.499.499 0 00-.618.343l-2 7a.51.51 0 000 .275l2 7A.5.5 0 0015 15.5a.481.481 0 00.138-.02.5.5 0 00.344-.618L13.52 8l1.961-6.862a.5.5 0 00-.344-.618z"></Path>
        </Svg>
    );
}

export default Icon;