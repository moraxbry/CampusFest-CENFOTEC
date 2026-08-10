const express = require('express');
const router = express.Router();

// TODO (Fase 4): mover esta lógica a controllers/enrollmentController.js

// POST /api/inscriptions → registra inscripción; asigna lista de espera si el cupo está lleno
router.post('/', (req, res) => {
  res.json({ success: true, message: 'Endpoint por implementar: crear inscripción' });
});

module.exports = router;
