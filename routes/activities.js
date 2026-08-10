const express = require('express');
const router = express.Router();

// TODO (Fase 3): mover esta lógica a controllers/activityController.js

// GET /api/activities  → lista con filtros por query params (category, date, status)
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Endpoint por implementar: listar actividades' });
});

// GET /api/activities/featured → las 3 con menor cupo disponible
router.get('/featured', (req, res) => {
  res.json({ success: true, message: 'Endpoint por implementar: actividades destacadas' });
});

// GET /api/activities/results → actividades concluidas con result publicado
router.get('/results', (req, res) => {
  res.json({ success: true, message: 'Endpoint por implementar: resultados' });
});

// GET /api/activities/:id → detalle de una actividad
router.get('/:id', (req, res) => {
  res.json({ success: true, message: `Endpoint por implementar: detalle de ${req.params.id}` });
});

module.exports = router;
