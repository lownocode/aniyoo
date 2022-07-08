import React from "react";

import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome5Pro from "react-native-vector-icons/FontAwesome5Pro";
import Fontisto from "react-native-vector-icons/Fontisto";
import Foundation from "react-native-vector-icons/Foundation";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Zocial from "react-native-vector-icons/Zocial";
import FontAwesome5IconVariants from "react-native-vector-icons/FontAwesome5";

export const Icon = (props) => {
    const { type } = props;
    
    return (
        type === "Feather" ? <Feather {...props} /> 
        : type === "Entypo" ? <Entypo {...props}/>
        : type === "EvilIcons" ? <EvilIcons {...props}/> 
        : type === "FontAwesome" ? <FontAwesome {...props}/>
        : type === "FontAwesome5" ? <FontAwesome5 {...props}/>
        : type === "FontAwesome5Pro" ? <FontAwesome5Pro {...props}/>
        : type === "Fontisto" ? <Fontisto {...props}/>
        : type === "Foundation" ? <Foundation {...props}/>
        : type === "Ionicons" ? <Ionicons {...props}/>
        : type === "MaterialCommunityIcons" ? <MaterialCommunityIcons {...props}/>
        : type === "MaterialIcons" ? <MaterialIcons {...props}/>
        : type === "Octicons" ? <Octicons {...props}/>
        : type === "SimpleLineIcons" ? <SimpleLineIcons {...props}/>
        : type === "Zocial" ? <Zocial {...props}/>
        : type === "AntDesign" ? <AntDesign {...props}/>
        : type === "FontAwesome5Brands" ? <FontAwesome5IconVariants brand {...props}/>
        : null
    )
};