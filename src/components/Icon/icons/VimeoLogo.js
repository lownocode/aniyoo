import React from "react";
import Svg, { Path, Circle, Rect } from "react-native-svg";

const Icon = (props) => {
    const {
        size = 15,
    } = props;

    return (
        <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        overflow="visible"
        version="1.1"
        viewBox="0 0 158.299 158.299"
        xmlSpace="preserve"
        >
            <Rect width="158.299" height="158.299" fill="#1AB7EA" rx="40" ry="40"></Rect>
            <Path
            fill="#FFF"
            d="M65.44 119.919c-4.729-3.936-6.697-8.271-11.433-26.604-4.918-18.125-7.49-25.022-10.244-26.005-3.542 0-5.91 1.577-9.064 3.151-1.377-1.774-2.754-3.348-4.139-5.123l7.687-7.287C51.45 45.635 58.35 42.48 64.056 46.422c3.752 2.565 5.326 6.7 7.687 20.1 2.958 16.548 5.123 24.038 7.491 26.21 1.968 1.777 2.164 1.581 5.122-1.188 4.729-4.525 10.639-16.352 10.639-21.474 0-5.323-2.368-6.896-8.474-5.913l-4.14.59 1.771-4.335c2.368-5.91 8.277-12.613 13.407-14.974 5.72-2.561 13.793-2.561 18.129 0 4.328 2.562 5.909 7.884 5.509 16.749-.591 9.064-5.509 19.113-16.745 34.093-16.744 22.458-30.152 30.342-38.626 23.048l-.386.591z"
            ></Path>
        </Svg>
    );
}

export default Icon;