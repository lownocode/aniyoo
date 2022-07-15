import React from "react";
import Svg, { G, Path } from "react-native-svg";

const Icon = (props) => {
    const {
        size = 15,
        color
    } = props;

    return (
      <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 512 512"
      >
          <G fill="none">
            <Path
                fill={color ? color : "#4285f4"}
                d="M293 153.4c0-10.6-.9-20.7-2.7-30.5H150v57.6h80.2c-3.4 18.6-13.9 34.4-29.7 45v37.4h48.2c28.2-25.9 44.4-64.1 44.4-109.5z"
                transform="matrix(1.5839 0 0 1.5839 18.416 18.416)"
            ></Path>
            <Path
                fill={color ? color : "#34a853"}
                d="M150 299c40.2 0 74-13.3 98.6-36.1l-48.1-37.4c-13.3 8.9-30.4 14.2-50.5 14.2-38.8 0-71.7-26.2-83.4-61.4H16.8v38.6C41.4 265.6 91.8 299 150 299z"
                transform="matrix(1.5839 0 0 1.5839 18.416 18.416)"
            ></Path>
            <Path
                fill={color ? color : "#fbbc05"}
                d="M66.6 178.3c-3-8.9-4.7-18.5-4.7-28.3s1.7-19.4 4.7-28.3V83.1H16.8C6.8 103.2 1 126 1 150c0 24 5.8 46.8 15.9 66.9l49.8-38.6z"
                transform="matrix(1.5839 0 0 1.5839 18.416 18.416)"
            ></Path>
            <Path
                fill={color ? color : "#ea4335"}
                d="M150 60.3c21.9 0 41.5 7.5 57 22.3l42.7-42.8C223.9 15.8 190.2 1 150 1 91.8 1 41.4 34.4 16.9 83.1l49.8 38.6c11.6-35.2 44.5-61.4 83.3-61.4z"
                transform="matrix(1.5839 0 0 1.5839 18.416 18.416)"
            ></Path>
            <Path
                d="M1 1h298v298H1V1z"
                transform="matrix(1.5839 0 0 1.5839 18.416 18.416)"
            ></Path>
          </G>
      </Svg>
    )
};

export default Icon;