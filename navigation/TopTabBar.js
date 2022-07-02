import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  View,
  TouchableOpacity,
  StyleSheet,
  I18nManager,
} from "react-native";
import AnimatedA from "react-native-reanimated";

const screenWidth = Dimensions.get("window").width;

const DISTANCE_BETWEEN_TABS = 20;

const TabBar = ({
  state,
  descriptors,
  navigation,
  position,
}) => {
  const [ widths, setWidths ] = useState([]);
  const scrollViewRef = useRef(null);
  const transform = [];
  const inputRange = state.routes.map((_, i) => i);

  const outputRangeRef = useRef([]);

  const trx = useRef(new AnimatedA.Value(0)).current;

  const getTranslateX = (
    position,
    routes,
    widths
  ) => {
    const outputRange = routes.reduce((acc, _, i) => {
      if (i === 0) return [DISTANCE_BETWEEN_TABS / 2 + widths[0] / 2];
      return [
        ...acc,
        acc[i - 1] + widths[i - 1] / 2 + widths[i] / 2 + DISTANCE_BETWEEN_TABS,
      ];
    }, []);
    outputRangeRef.current = outputRange;
    const translateX = position.interpolate({
      inputRange,
      outputRange,
      extrapolate: "clamp",
    });
    console.log("RTL ", I18nManager.isRTL)
    return Animated.multiply(translateX, I18nManager.isRTL ? -1 : 1);
  };

  // compute translateX and scaleX because we cannot animate width directly
  if (
    state.routes.length > 1 &&
    widths.length === state.routes.length &&
    !widths.includes(undefined)
  ) {
    const translateX = getTranslateX(
      position,
      state.routes,
      widths
    );

    trx.setValue(23)
    console.log(translateX)

    transform.push({
      translateX,
    });
    
    const outputRange = inputRange.map((_, i) => widths[i]);
    console.log(state.routes.length > 1
        ? position.interpolate({
            inputRange,
            outputRange,
          //   extrapolate: "clamp",
          })
        : outputRange[0])

        transform.push({
            scaleX:50,
            scaleY: 50,
            flex: 1
        });
    // transform.push({
    //   scaleX:
        // state.routes.length > 1
        //   ? position.interpolate({
        //       inputRange,
        //       outputRange,
        //     //   extrapolate: "clamp",
        //     })
        //   : outputRange[0],
    // });
  }

  useEffect(() => {
    if (
      state.routes.length > 1 &&
      widths.length === state.routes.length &&
      !widths.includes(undefined)
    ) {
      if (state.index === 0) {
        scrollViewRef.current?.scrollTo({
          x: 0,
        });
      } else {
        console.log((outputRangeRef.current[state.index]) - screenWidth / 2,)
        // keep the focused label at the center of the screen
        scrollViewRef.current?.scrollTo({
          x: (outputRangeRef.current[state.index]) - screenWidth / 2,
        });
      }
    }
  }, [state.index, state.routes.length, widths]);

  const onLayout = (event, index) => {
    const { width } = event.nativeEvent.layout;
    const newWidths = [...widths];
    newWidths[index] = width - DISTANCE_BETWEEN_TABS;
    console.log("onLayout", newWidths);
    setWidths(newWidths);
  };

  const labels = state.routes.map((route, index) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === index;

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate({ name: route.name, merge: true });
      }
    };
    const inputRange = state.routes.map((_, i) => i);
    const opacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map((i) => (i === index ? 1 : 0.5)),
    });

    return (
      <TouchableOpacity
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        onPress={onPress}
        style={styles.button}
      >
        <View
          onLayout={(event) => onLayout(event, index)}
          style={styles.buttonContainer}
        >
          <Animated.Text style={[styles.text, { opacity }]}>
            {options.title}
          </Animated.Text>
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <View style={styles.contentContainer}>
      <Animated.ScrollView
        horizontal
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        style={styles.container}
      >
        {labels}
            <AnimatedA.View style={[styles.indicator, { width: 20, translateX: trx }]} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    paddingHorizontal: DISTANCE_BETWEEN_TABS / 2,
  },
  container: {
    backgroundColor: "red",
    flexDirection: "row",
    height: 34,
  },
  contentContainer: {
    height: 34,
  },
  indicator: {
    backgroundColor: "white",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    width: 2,
    height: 4,
    borderRadius: 100,
  },
  text: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
});

export default TabBar;