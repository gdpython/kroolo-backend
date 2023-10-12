/**
 * index.js
 * @description :: express routes of authentication APIs
 */

const express = require('express');
const router = express.Router();
const authController = require('../../../controllers/authentication/v1/authController');
const { PLATFORM_ACCESS } = require('../../../constants/authConstant');
const auth = require('../../../middleware/mongoose/authUser');

router.post('/login', auth(PLATFORM_ACCESS.OWNER, "PROJECT"), authController.ownerLogin);
module.exports = router;