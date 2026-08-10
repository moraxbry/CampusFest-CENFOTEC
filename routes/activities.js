const express = require('express');
const router = express.Router();

const {
  getActivities,
  getFeaturedActivities,
  getActivityResults,
  getActivityById,
} = require('../controllers/activityController');

router.get('/', getActivities);
router.get('/featured', getFeaturedActivities);
router.get('/results', getActivityResults);
router.get('/:id', getActivityById);

module.exports = router;