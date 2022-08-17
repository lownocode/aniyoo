import React, { useRef, useState } from "react";
import { 
    TouchableNativeFeedback, 
    View,
} from "react-native";
import { useSelector } from "react-redux";
import { Transition, Transitioning } from "react-native-reanimated";

export const Accordion = (props) => {
    const { theme } = useSelector(state => state.theme);

    const {
        children,
        trigger,
        onChange = () => {}
    } = props;

    const [ open, setOpen ] = useState(false);

    const changeOpen = () => {
        onChange(!open);
        setOpen(prev => !prev);
        transitionRef.current?.animateNextTransition()
    };

    const transitionRef = useRef();

    const transition = (
        <Transition.Together>
            <Transition.In type="fade" durationMs={200} />
            <Transition.Change/>
            <Transition.Out type="fade" durationMs={200} />
        </Transition.Together>
    );

    return (
        <Transitioning.View
        transition={transition}
        ref={transitionRef}
        style={{
            marginVertical: 5,
            marginHorizontal: 15
        }}
        >
            <View
            style={{
                borderRadius: 10,
                overflow: "hidden",
                backgroundColor: theme.accordion_background,
                borderBottomLeftRadius: open ? 5 : 10,
                borderBottomRightRadius: open ? 5 : 10
            }}
            >
                <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                onPress={() => changeOpen()}
                >
                    <View>
                        {
                            trigger
                        }
                    </View>
                </TouchableNativeFeedback>
            </View>

            <View
            
            style={{
                marginTop: open ? 5 : 0,
                borderRadius: 10,
                backgroundColor: theme.accordion_background,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                height: open ? "auto" : 0,
                overflow: "hidden"
            }}
            >
                {
                    children
                }
            </View>
        </Transitioning.View>
    )
};