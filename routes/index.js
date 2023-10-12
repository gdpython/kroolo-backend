/**
 * index.js
 * @description :: index route of all modules
 */

const express = require('express');
const router = express.Router();
router.use(require('./authentication/v1/index'));

module.exports = router;