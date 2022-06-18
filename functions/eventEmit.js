import { EventRegister } from "react-native-event-listeners";

export const EventEmit = (events = [], data) => {
    if(typeof events !== "object") {
        return EventRegister.emit(events, data);
    }    

    events.map((event) => {
        EventRegister.emit(event, data);
    });
};