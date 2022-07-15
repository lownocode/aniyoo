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
            fillRule="evenodd"
            d="M9.5 3a1 1 0 011-1h3a1 1 0 011 1v1.399c.383.125.752.28 1.107.459l.99-.99a1 1 0 011.413 0l2.122 2.122a1 1 0 010 1.414l-.99.99c.18.354.334.723.46 1.106H21a1 1 0 011 1v3a1 1 0 01-1 1h-1.399a7.94 7.94 0 01-.459 1.107l.99.99a1 1 0 010 1.413l-2.122 2.122a1 1 0 01-1.414 0l-.99-.99a7.94 7.94 0 01-1.106.46V21a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1.399a7.941 7.941 0 01-1.107-.459l-.99.99a1 1 0 01-1.413 0L3.868 18.01a1 1 0 010-1.414l.99-.99a7.955 7.955 0 01-.46-1.106H3a1 1 0 01-1-1v-3a1 1 0 011-1h1.399c.125-.383.28-.752.459-1.107l-.99-.99a1 1 0 010-1.413L5.99 3.868a1 1 0 011.414 0l.99.99c.354-.18.723-.334 1.106-.46V3zm.038 4.613a1 1 0 011.035.068l5 3.5a1 1 0 010 1.638l-5 3.5A1 1 0 019 15.5v-7a1 1 0 01.538-.887z"
            clipRule="evenodd"
            ></Path>
        </Svg>
    );
}

export default Icon;