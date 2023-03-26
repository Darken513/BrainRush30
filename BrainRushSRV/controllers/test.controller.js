const testDB = require("../models/test.model");
const uaDB = require("../models/userAttempt.model");
const jwtService = require("../services/jwtservice")
exports.generateTest = async (req, res) => {
    let userDetails = await jwtService.verifySync(req.headers.authorization)
    let currentDay = await uaDB.fetchCurrentDay(userDetails.id);
    if(currentDay<req.params.day){
        res.status(403).json({error:'Unauthorized access'})
        return;
    }
    let userAttemp = await uaDB.createNew(req.params.day, userDetails.id)
    res.json(userAttemp)
};
exports.gradeTest = async (req, res) => {

};
exports.viewAttempt = async (req, res) => {

};
