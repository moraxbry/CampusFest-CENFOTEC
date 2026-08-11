const express = require('express');
const router = express.Router();
const { createInscription } = require('../controllers/enrollmentController');

router.post('/', createInscription);

module.exports = router;