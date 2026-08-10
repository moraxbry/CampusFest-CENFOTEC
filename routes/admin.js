const express = require('express');
const router = express.Router();

// TODO (Fase 7): mover esta lógica a controllers/adminController.js
// Nota: por decisión del proyecto, estas rutas NO llevan middleware de
// autenticación (a diferencia de lo sugerido originalmente en el README).

// --- Actividades ---
router.post('/activities', (req, res) => {
  res.json({ success: true, message: 'Endpoint por implementar: crear actividad' });
});

router.put('/activities/:id', (req, res) => {
  res.json({ success: true, message: `Endpoint por implementar: editar actividad ${req.params.id}` });
});

router.delete('/activities/:id', (req, res) => {
  res.json({ success: true, message: `Endpoint por implementar: eliminar actividad ${req.params.id}` });
});

router.put('/activities/:id/result', (req, res) => {
  res.json({ success: true, message: `Endpoint por implementar: publicar resultado de ${req.params.id}` });
});

// --- Inscripciones ---
router.get('/inscriptions', (req, res) => {
  res.json({ success: true, message: 'Endpoint por implementar: listar inscripciones y listas de espera' });
});

router.put('/inscriptions/:id', (req, res) => {
  res.json({ success: true, message: `Endpoint por implementar: modificar inscripción ${req.params.id}` });
});

// --- Stands ---
router.post('/stands', (req, res) => {
  res.json({ success: true, message: 'Endpoint por implementar: crear stand' });
});

router.put('/stands/:id', (req, res) => {
  res.json({ success: true, message: `Endpoint por implementar: editar stand ${req.params.id}` });
});

// --- Configuration ---
router.put('/configuration/:section', (req, res) => {
  res.json({ success: true, message: `Endpoint por implementar: editar configuration.${req.params.section}` });
});

module.exports = router;
