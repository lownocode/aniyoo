import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';

export const storage = {
    setItem: async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
            return value;
        } catch (error) {
            ToastAndroid.show("Возникла ошибка при сохранении значения", ToastAndroid.SHORT) 
        }
    },
    getItem: async (key) => {
        try {
            const item = await AsyncStorage.getItem(key);
            return JSON.parse(item);
        } catch (error) {
            ToastAndroid.show("Возникла ошибка при получении значения", ToastAndroid.SHORT) 
        }
    },
    removeItem: async (key) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            ToastAndroid.show("Возникла ошибка при удалении значения", ToastAndroid.SHORT) 
        }
    },
    updateItem: async (key, value) => {
        try {
            const item = await AsyncStorage.getItem(key);
            const result = {...JSON.parse(item), ...value};

            await AsyncStorage.setItem(key, JSON.stringify(result));   
        } catch (error) {
            ToastAndroid.show("Возникла ошибка при обновлении значения", ToastAndroid.SHORT) 
        }
    }
};