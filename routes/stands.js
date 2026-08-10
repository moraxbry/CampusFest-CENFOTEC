const express = require('express');
const router = express.Router();

// TODO (Fase 3): mover esta lógica a controllers/standController.js

// GET /api/stands → lista todos los stands y grupos participantes
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Endpoint por implementar: listar stands' });
});

module.exports = router;
