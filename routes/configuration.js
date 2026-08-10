const express = require('express');
const router = express.Router();

// TODO (Fase 3): mover esta lógica a controllers/adminController.js

// GET /api/configuration → contenido dinámico de inicio y contacto
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Endpoint por implementar: obtener configuration' });
});

// POST /api/contact → envía una consulta desde el formulario de contacto
router.post('/contact', (req, res) => {
  res.json({ success: true, message: 'Endpoint por implementar: enviar contacto' });
});

module.exports = router;
