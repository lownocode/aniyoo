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
        viewBox="0 0 1024 1024"
        fill={color}
        width={size}
        height={size}
        >
            <Path d="M962.89 307.82c-12.876-8.273-28.122-13.735-45.314-16.233l-222-32.258-99.281-201.167c-7.688-15.578-17.594-28.39-29.441-38.08C550.792 6.944 531.824 0 512 0s-38.792 6.944-54.854 20.082c-11.847 9.69-21.752 22.502-29.44 38.08l-99.282 201.167-222 32.258c-17.192 2.498-32.438 7.96-45.315 16.233-17.458 11.216-29.924 27.11-36.05 45.963s-5.383 39.04 2.148 58.376c5.555 14.261 14.68 27.64 27.12 39.767l160.64 156.586-37.922 221.103c-5.517 32.166 1.324 61.599 19.262 82.875a82.69 82.69 0 0030.681 22.806 87.252 87.252 0 0034.824 7.072c17.016 0 34.385-4.595 51.624-13.659L512 824.32l198.563 104.39c17.24 9.064 34.609 13.66 51.625 13.66a87.238 87.238 0 0034.826-7.075 82.688 82.688 0 0030.677-22.804c17.94-21.277 24.78-50.71 19.264-82.874l-37.922-221.104 160.641-156.587c12.44-12.125 21.564-25.505 27.119-39.766 7.531-19.336 8.274-39.522 2.148-58.376s-18.592-34.747-36.05-45.963zm-37.889 98.276l-173.44 169.063a30 30 0 00-8.629 26.555l40.944 238.72c4.096 23.885-5.067 37.934-21.688 37.934-6.312 0-13.698-2.025-21.843-6.307L525.961 759.353a30.002 30.002 0 00-27.922 0L283.655 872.061c-8.143 4.28-15.532 6.307-21.843 6.307-16.624 0-25.785-14.047-21.688-37.934l40.944-238.72a30 30 0 00-8.629-26.555L99 406.096c-23.942-23.338-16.46-46.366 16.627-51.174l239.689-34.829a30.002 30.002 0 0022.59-16.412L485.095 86.486C492.495 71.496 502.247 64 512 64s19.505 7.495 26.904 22.486l107.192 217.195a30.002 30.002 0 0022.589 16.412l239.689 34.83c33.087 4.807 40.57 27.835 16.627 51.173z"></Path>
        </Svg>
    );
    }

export default Icon;