const uaDB = require("./../models/userAttempt.model");
const mailsender = require("./mailsender")
let schedueledList = {};

exports.scheduelMail = (userDetails) => {
    let scheduled = schedueledList[userDetails.id];
    if (scheduled) {
        if (userDetails.notif_time == scheduled.notif_time) {
            return;
        } else {
            clearTimeout(scheduled.timeoutId);
        }
    }
    let newTimeoutId = timeoutMail(userDetails);
    schedueledList[userDetails.id] = { timeoutId: newTimeoutId, notif_time: userDetails.notif_time }
}
function timeDifferenceInSeconds(time1, time2) {
    const time1Array = time1.split(':');
    const time2Array = time2.split(':');
    const time1Seconds = (+time1Array[0]) * 60 * 60 + (+time1Array[1]) * 60 + (+time1Array[2]);
    const time2Seconds = (+time2Array[0]) * 60 * 60 + (+time2Array[1]) * 60 + (+time2Array[2]);
    const differenceInSeconds = time2Seconds - time1Seconds;
    return differenceInSeconds;
}
function getTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}:${seconds}`;
    return currentTime;
}
function timeoutMail(userDetails, unchanged) {
    let sendAfter = unchanged ? 86400 : timeDifferenceInSeconds(getTime(new Date()), userDetails.notif_time + ":00");
    sendAfter = sendAfter < 0 ? sendAfter + 86400 : sendAfter;
    return setTimeout(async () => {
        let lastUserAttempt = await uaDB.fetchCurrentDay(userDetails.id)
        let attemptDate = lastUserAttempt ? new Date(lastUserAttempt.attempted_at) : undefined;
        let today = new Date();
        if (!(attemptDate && attemptDate.getFullYear() === today.getFullYear() &&
            attemptDate.getMonth() === today.getMonth() &&
            attemptDate.getDate() === today.getDate() &&
            lastUserAttempt.score >= lastUserAttempt.passing_score)) {
                mailsender.sendMail(userDetails);
        }
        let newTimeoutId = timeoutMail(userDetails, true);
        schedueledList[userDetails.id] = { timeoutId: newTimeoutId, notif_time: userDetails.notif_time }
    }, sendAfter * 1000)
}