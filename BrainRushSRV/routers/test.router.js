const express = require('express');
const controller = require('../controllers/test.controller');

const router = express.Router();

router.get('/generate', controller.generateTest);
router.get('/grade', controller.gradeTest);
router.get('/viewold', controller.viewAttempt);

module.exports = router;