import React, { useContext } from "react";
import Svg, { G, Path, Rect } from "react-native-svg";

import ThemeContext from "../../../config/ThemeContext";

const Icon = (props) => {
    const theme = useContext(ThemeContext);

    const {
        size = 15
    } = props;
      
    return (
        <Svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 32 32"
        width={size}
        height={size}
        >
            <G>
                <Path
                fill="#0e6ae0"
                d="M27 15h-6a1 1 0 01-1-1v-3a4 4 0 018 0v3a1 1 0 01-1 1zm-5-2h4v-2a2 2 0 00-4 0z"
                ></Path>
                <Path
                fill="#0e6ae050"
                d="M21 23a1 1 0 01-1-1v-5a1 1 0 00-1-1H5a3 3 0 00-3 3v3a3 3 0 003 3h16a1 1 0 000-2z"
                ></Path>
                <Path
                fill="#0593ff"
                d="M7.85 19.15a.48.48 0 00-.7 0l-.65.64-.65-.64a.49.49 0 00-.7.7l.64.65-.64.65a.49.49 0 00.7.7l.65-.64.65.64a.49.49 0 10.7-.7l-.64-.65.64-.65a.48.48 0 000-.7zM11.85 19.15a.48.48 0 00-.7 0l-.65.64-.65-.64a.49.49 0 00-.7.7l.64.65-.64.65a.49.49 0 00.7.7l.65-.64.65.64a.49.49 0 10.7-.7l-.64-.65.64-.65a.48.48 0 000-.7zM15.21 20.5l.64-.65a.49.49 0 00-.7-.7l-.65.64-.65-.64a.49.49 0 00-.7.7l.64.65-.64.65a.49.49 0 00.7.7l.65-.64.65.64a.49.49 0 10.7-.7z"
                ></Path>
                <Rect
                width="12"
                height="12"
                x="18"
                y="13"
                fill="#0593ff"
                rx="3"
                ry="3"
                ></Rect>
                <Path
                fill={theme.background_content}
                d="M26 18a2 2 0 10-3 1.72V21a1 1 0 002 0v-1.28A2 2 0 0026 18z"
                ></Path>
            </G>
        </Svg>
    );
}

export default Icon;