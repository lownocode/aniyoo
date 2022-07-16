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
        fillRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit="2"
        clipRule="evenodd"
        viewBox="0 0 24 24"
        fill={color}
        width={size}
        height={size}
        >
            <Path d="M4.251 9.031l.34 8.167a4.75 4.75 0 004.746 4.552h5.326a4.75 4.75 0 004.746-4.552l.34-8.167a.75.75 0 10-1.498-.062l-.341 8.166a3.25 3.25 0 01-3.247 3.115H9.337a3.25 3.25 0 01-3.247-3.115l-.341-8.166a.75.75 0 10-1.498.062zM7.459 5.25l.374-1.12a2.75 2.75 0 012.609-1.88h3.116a2.75 2.75 0 012.609 1.88l.374 1.12H20a.75.75 0 010 1.5H4a.75.75 0 010-1.5h3.459zm7.5 0l-.215-.645a1.249 1.249 0 00-1.186-.855h-3.116c-.539 0-1.016.344-1.186.855l-.215.645h5.918z"></Path>
            <Path d="M9.25 11v5a.75.75 0 001.5 0v-5a.75.75 0 00-1.5 0zM13.25 11v5a.75.75 0 001.5 0v-5a.75.75 0 00-1.5 0z"></Path>
        </Svg>
    );
}

export default Icon;