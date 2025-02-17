const express = require('express');
const controller = require('../controllers/home.controller');

const router = express.Router();

router.get('/general', controller.fetchGeneralDetails);

module.exports = router;