const express = require('express');
const router = express.Router();
const {
  createActivity,
  updateActivity,
  deleteActivity,
  publishActivityResult,
  getInscriptions,
  updateInscription,
  createStand,
  updateStand,
  updateConfiguration,
} = require('../controllers/adminController');

// Nota: por decisión del proyecto, estas rutas NO llevan middleware de
// autenticación (a diferencia de lo sugerido originalmente en el README).

// --- Actividades ---
router.post('/activities', createActivity);
router.put('/activities/:id', updateActivity);
router.delete('/activities/:id', deleteActivity);
router.put('/activities/:id/result', publishActivityResult);

// --- Inscripciones ---
router.get('/inscriptions', getInscriptions);
router.put('/inscriptions/:id', updateInscription);

// --- Stands ---
router.post('/stands', createStand);
router.put('/stands/:id', updateStand);

// --- Configuration ---
router.put('/configuration/:section', updateConfiguration);

module.exports = router;