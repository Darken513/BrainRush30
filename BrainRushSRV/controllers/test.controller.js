const testDB = require("../models/test.model");
const jwtService = require("../services/jwtservice")
exports.generateTest = async (req, res) => {
    let userDetails = await jwtService.verifySync(req.headers.authorization)
    res.json("sa77ayt")
};
exports.gradeTest = async (req, res) => {

};
exports.viewAttempt = async (req, res) => {

};
