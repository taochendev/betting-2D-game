import moment from "moment";

export function msToTime(ms: number): any {
    let days = Math.floor(ms / (24*60*60*1000));
    let daysms= ms % (24*60*60*1000);
    let hours = Math.floor((daysms)/(60*60*1000));
    let hoursms=ms % (60*60*1000);
    let minutes = Math.floor((hoursms)/(60*1000));
    let minutesms=ms % (60*1000);
    let sec = Math.floor((minutesms)/(1000));
    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: sec
    };
}

export function numberWithCommas(x: number) {
    if (!x) return '0'
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function fiatWithCommas(x: number) {
    return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const chunk = (arr: Array<any>, size: number): Array<Array<any>> => {
    const newArr = [];
    while(arr.length) newArr.push(arr.splice(0, size));
    return newArr;
}

export const endDate = (end: any): Array<string> => {
    const fix = (value: number): string => {
        return value < 10 ? '0' + value.toFixed(0) : value.toFixed(0);
    }
    var delta = Math.abs(Date.parse(end) - new Date().getTime()) / 1000;

    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    var seconds = delta % 60;

    return [ fix(days), fix(hours), fix(minutes), fix(seconds) ]
}


export function toRuneScapeFormatFromExact(value: number | undefined): string {
    if (!value) {
        value = 0
    }
    const negative = value < 0;
    if (negative) {
        value *= -1;
    }
    if (value >= 1_000_000_000) {
        const amountLeftOver = value % 10_000_000
        if (amountLeftOver > 10_000_000) {
            return (negative ? "-" : "") + (value / 10_000_000).toFixed(1) + 'B'
        }
        return (negative ? "-" : "") + (value - amountLeftOver) / 1_000_000_000 + 'B'
    }
    if (value >= 10_000_000) {
        const amountLeftOver = value % 100_000
        return (negative ? "-" : "") + (value - amountLeftOver) / 1_000_000 + 'M'
    }
    if (value >= 1_000_000) {
        const amountLeftOver = value % 10_000
        if (amountLeftOver == 0) {
            return (negative ? "-" : "") + (value / 1_000_000).toFixed(0) + 'M'
        }
        return (negative ? "-" : "") + ((value - amountLeftOver) / 1_000_000).toFixed(2) + 'M'
    }
    if (value >= 100_000) {
        const amountLeftOver = value % 1_000
        return (negative ? "-" : "") + ((value - amountLeftOver) / 1_000) + 'K'
    }
    if (value >= 1_000) {
        return (negative ? "-" : "" ) + ((value) / 1_000).toFixed((((value) / 1_000) % 1) == 0 ? 0 : 2) + 'K'
    }
    return (negative ? "-" : "") + value.toString()
}

export function formatDateTime(date: Date) {
    var newDate = moment(date);
    return newDate.format("MMMM DD - HH:mm")
}


export function formatDateTimeYear(date: Date) {
    var newDate = moment(date);
    return newDate.format("DD MMMM YYYY - HH:mm A")
}