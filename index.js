import {AppRegistry} from 'react-native';
import axios from "axios";

import App from './App';
import { REQUEST_DOMAIN } from "./variables";

axios.defaults.baseURL = REQUEST_DOMAIN;
AppRegistry.registerComponent("aniyoo", () => App);