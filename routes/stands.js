const express = require('express');
const router = express.Router();
const { getStands } = require('../controllers/standController');

router.get('/', getStands);

module.exports = router;