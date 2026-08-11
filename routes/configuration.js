const express = require('express');
const router = express.Router();
const { getConfiguration, sendContact } = require('../controllers/configurationController');

// GET /api/configuration → contenido dinámico de inicio y contacto
router.get('/configuration', getConfiguration);

// POST /api/contact → envía una consulta desde el formulario de contacto
router.post('/contact', sendContact);

module.exports = router;
