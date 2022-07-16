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
        viewBox="0 0 512 512"
        width={size}
        height={size}
        >
            <Path
            fill={color}
            d="M268.279 496c-67.574 0-130.978-26.191-178.534-73.745S16 311.293 16 243.718A252.252 252.252 0 01154.183 18.676a24.44 24.44 0 0134.46 28.958 220.12 220.12 0 0054.8 220.923A218.746 218.746 0 00399.085 333.2a220.2 220.2 0 0065.277-9.846 24.439 24.439 0 0128.959 34.461A252.256 252.256 0 01268.279 496zM153.31 55.781A219.3 219.3 0 0048 243.718C48 365.181 146.816 464 268.279 464a219.3 219.3 0 00187.938-105.31 252.912 252.912 0 01-57.13 6.513 250.539 250.539 0 01-178.268-74.016 252.147 252.147 0 01-67.509-235.4z"
            className="ci-primary"
            ></Path>
        </Svg>
    );
}

export default Icon;