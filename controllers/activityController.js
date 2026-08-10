const Activity = require('../models/Activity');

// GET /api/activities
exports.getActivities = async (req, res) => {
    try {
        const { category, date, status } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (status) filter.status = status;
        if (date) filter.date = new Date(date);

        const activities = await Activity.find(filter).sort({ date: 1, time: 1 });
        res.json({ success: true, data: activities });
    } catch (error) {
        console.error('Error al listar actividades:', error);
        res.status(500).json({ success: false, message: 'No se pudieron obtener las actividades.' });
    }
};

// GET /api/activities/featured
exports.getFeaturedActivities = async (req, res) => {
    try {
        const activities = await Activity.find({ status: 'available' });

        const featured = activities
        .sort((a, b) => (a.maxCapacity - a.takenSpots) - (b.maxCapacity - b.takenSpots))
        .slice(0, 3);

        res.json({ success: true, data: featured });
    } catch (error) {
        console.error('Error al obtener destacadas:', error);
        res.status(500).json({ success: false, message: 'No se pudieron obtener las actividades destacadas.' });
    }
};

// GET /api/activities/results
exports.getActivityResults = async (req, res) => {
    try {
        const activities = await Activity.find({ result: { $ne: null } }).sort({ 'result.publishedAt': -1 });
        res.json({ success: true, data: activities });
    } catch (error) {
        console.error('Error al obtener resultados:', error);
        res.status(500).json({ success: false, message: 'No se pudieron obtener los resultados.' });
    }
};

// GET /api/activities/:id
exports.getActivityById = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
        return res.status(404).json({ success: false, message: 'Actividad no encontrada.' });
        }
        res.json({ success: true, data: activity });
    } catch (error) {
        console.error('Error al obtener actividad:', error);
        res.status(500).json({ success: false, message: 'No se pudo obtener la actividad.' });
    }
};