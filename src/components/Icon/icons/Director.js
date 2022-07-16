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
        data-name="Layer 1"
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill={color}
        >
            <Path d="M13.1 9.58l5.27 9.54a1.7 1.7 0 001.49.88h5.93a.73.73 0 00.64-1.09L20.67 8.49a.85.85 0 00-.76-.49h-4a11.75 11.75 0 00-2.14.2.94.94 0 00-.67 1.38zM44.88 20H51a.89.89 0 00.78-1.32L46.17 8.49a.9.9 0 00-.79-.49h-6.15a.89.89 0 00-.78 1.32l5.65 10.22a.89.89 0 00.78.46zM4 19.6a.39.39 0 00.38.4h8.34a.92.92 0 00.8-1.36l-4.08-7.41A.92.92 0 008 11a12.11 12.11 0 00-4 8.6zM53.72 8h-1.47a1 1 0 00-.92 1.56l5.47 9.9a1 1 0 00.92.54H59a1 1 0 001-1v-4.72A6.3 6.3 0 0053.72 8zM25.56 9.06l5.84 10.57a.72.72 0 00.6.37h6.54a.72.72 0 00.63-1.06L33.42 8.49V8.4a.7.7 0 00-.68-.4h-6.55a.72.72 0 00-.63 1.06zM58.8 24H4v20.12A11.92 11.92 0 0015.88 56h32.24A11.92 11.92 0 0060 44.12V25.2a1.2 1.2 0 00-1.2-1.2z"></Path>
        </Svg>
    );
}

export default Icon;