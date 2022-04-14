export const dateFormatter = (unix = 0) => {
    const date = new Date(unix);
    const months = [`января`,`февраля`,`марта`,`апреля`,`мая`,`июня`,`июля`,`августа`,`сентября`,`октября`,`ноября`,`декабря`];

    const day = date.getDate();
    const monthNumber = date.getMonth();
    let monthName;
    const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    const year = date.getFullYear();

    const time = hours + ":" + minutes;

    if(+new Date() - Number(unix) < 86400000) {
        monthName = "сегодня"
    }

    if(+new Date() - Number(unix) > 86400000 && +new Date() - Number(unix) < 172800000) {
        monthName = "вчера"
    }

    if(monthName === "сегодня" || monthName === "вчера") {
        return monthName + " в " + time;
    }

    monthName = months[monthNumber];
    const _year = year < new Date().getFullYear() ? year + "г. " : "";

    return day + " " + monthName + " " + _year + "в " + time;
};