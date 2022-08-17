import React from "react";
import { useSelector } from "react-redux";

import {
    Icon,
    Panel,
    Placeholder
} from "../components";

export const Notices = () => {
    const { theme } = useSelector(state => state.theme);

    return (
        <Panel
        headerProps={{
            title: "Уведомления",
        }}
        >
            <Placeholder
            title="Уведомлений нет"
            subtitle="Вы ещё не получили ни одного уведомления от системы"
            icon={
                <Icon
                name="notifications-disable"
                color={theme.accent}
                size={50}
                />
            }
            />
        </Panel>
    )
};