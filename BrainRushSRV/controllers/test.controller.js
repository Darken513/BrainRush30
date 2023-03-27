const testDB = require("../models/test.model");
const uaDB = require("../models/userAttempt.model");
const jwtService = require("../services/jwtservice")

exports.generateTest = async (req, res) => {
  let userDetails = await jwtService.verifySync(req.headers.authorization)
  let currentDay = await uaDB.fetchCurrentDay(userDetails.id);
  if (currentDay < req.params.day) {
      res.status(403).json({ error: 'Unauthorized access' })
      return;
  }
  let userAttemp = await uaDB.createNew(req.params.day, userDetails.id)
  setTimeout(()=>{
    res.json(userAttemp)
  },1500)
};
exports.gradeTest = async (req, res) => {
  let testResult = req.body;
  let userAttempResult = await uaDB.gradeTestAndFlush(testResult)
  res.json({userAttempResult});
};
exports.viewAttempt = async (req, res) => {
  let test_id = req.params.id;
  let userAttemp = await uaDB.getByTestId(test_id)
  res.json(userAttemp)
};
