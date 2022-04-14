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

export const Icon = ({ type, color, name, size, style }) => {
    return (
        type === "Feather" ? <Feather style={style} name={name} size={size} color={color}/> 
        : type === "Entypo" ? <Entypo style={style} name={name} size={size} color={color}/>
        : type === "EvilIcons" ? <EvilIcons style={style} name={name} size={size} color={color}/> 
        : type === "FontAwesome" ? <FontAwesome style={style} name={name} size={size} color={color}/>
        : type === "FontAwesome5" ? <FontAwesome5 style={style} name={name} size={size} color={color}/>
        : type === "FontAwesome5Pro" ? <FontAwesome5Pro style={style} name={name} size={size} color={color}/>
        : type === "Fontisto" ? <Fontisto style={style} name={name} size={size} color={color}/>
        : type === "Foundation" ? <Foundation style={style} name={name} size={size} color={color}/>
        : type === "Ionicons" ? <Ionicons style={style} name={name} size={size} color={color}/>
        : type === "MaterialCommunityIcons" ? <MaterialCommunityIcons style={style} name={name} size={size} color={color}/>
        : type === "MaterialIcons" ? <MaterialIcons style={style} name={name} size={size} color={color}/>
        : type === "Octicons" ? <Octicons style={style} name={name} size={size} color={color}/>
        : type === "SimpleLineIcons" ? <SimpleLineIcons style={style} name={name} size={size} color={color}/>
        : type === "Zocial" ? <Zocial style={style} name={name} size={size} color={color}/>
        : type === "AntDesign" ? <AntDesign style={style} name={name} size={size} color={color}/>
        : null
    )
};