const uaDB = require("../models/userAttempt.model");
const jwtService = require("../services/jwtservice");

exports.fetchGeneralDetails = async (req, res) => {
    let userDetails = await jwtService.verifySync(req.headers.authorization)
    await uaDB.clearUnfinished(userDetails.id);
    let toret = await uaDB.fetchGeneralDetails(userDetails.id);
    res.json(toret);
}
exports.viewAttempt = async (req, res) => {
    /*
        SELECT ua.*, max(score)
        FROM USER_ATTEMPTS ua
        JOIN TESTS ON ua.test_id = TESTS.id
        GROUP BY day
    */
};
