const uaDB = require("./../models/userAttempt.model");
const userDB = require("./../models/user.model");
const mailsender = require("./mailsender");

// A map to keep track of scheduled mails by user ID
const scheduledList = {};

// Schedule a mail to be sent to the user at the specified notification time
exports.scheduleMail = (userDetails) => {
    // Check if a mail has already been scheduled for this user
    const scheduled = scheduledList[userDetails.id];
    if (scheduled) {
        // If a mail has already been scheduled, check if the notification time is unchanged
        if (userDetails.notif_time === scheduled.notif_time) {
            return;
        } else {
            // If the notification time has changed, cancel the previously scheduled mail
            clearTimeout(scheduled.timeoutId);
        }
    }
    // Schedule the new mail
    const newTimeoutId = scheduleTimeoutMail(userDetails);
    scheduledList[userDetails.id] = { timeoutId: newTimeoutId, notif_time: userDetails.notif_time };
};

// Calculate the time difference in seconds between two time strings in the format "hh:mm:ss"
function timeDifferenceInSeconds(time1, time2) {
    const time1Array = time1.split(":");
    const time2Array = time2.split(":");
    const time1Seconds = (+time1Array[0]) * 60 * 60 + (+time1Array[1]) * 60 + (+time1Array[2]);
    const time2Seconds = (+time2Array[0]) * 60 * 60 + (+time2Array[1]) * 60 + (+time2Array[2]);
    const differenceInSeconds = time2Seconds - time1Seconds;
    return differenceInSeconds;
}

// Get the current time in the format "hh:mm:ss"
function getTime(date) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const currentTime = `${hours}:${minutes}:${seconds}`;
    return currentTime;
}

// Schedule a mail to be sent to the user after a certain time delay
function scheduleTimeoutMail(userDetails, unchanged) {
    // Calculate the time delay until the next notification time
    let sendAfter = unchanged ? 86400 : timeDifferenceInSeconds(getTime(new Date()), userDetails.notif_time + ":00");
    sendAfter = sendAfter < 0 ? sendAfter + 86400 : sendAfter;
    // Schedule the mail to be sent after the specified delay
    return setTimeout(async () => {
        const lastUserAttempt = await uaDB.fetchCurrentDay(userDetails.id);
        const attemptDate = lastUserAttempt ? new Date(lastUserAttempt.attempted_at) : undefined;
        const today = new Date();
        // Check if the user has already attempted a quiz today and passed
        if (!(attemptDate && attemptDate.getFullYear() === today.getFullYear() &&
            attemptDate.getMonth() === today.getMonth() &&
            attemptDate.getDate() === today.getDate() &&
            lastUserAttempt.score >= lastUserAttempt.passing_score)) {
            mailsender.sendMail(userDetails);
        }
        // Schedule the next mail recursively
        const newTimeoutId = scheduleTimeoutMail(userDetails, true);
        scheduledList[userDetails.id] = { timeoutId: newTimeoutId, notif_time: userDetails.notif_time };
    }, sendAfter * 1000);
}

exports.initSchedulers = async (db) => {
    let users = await userDB.getAll();
    if(!users)
        return;
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        exports.scheduleMail(user)
    }
}