const Stand = require('../models/Stand');

// GET /api/stands
exports.getStands = async (req, res) => {
    try {
        const stands = await Stand.find().sort({ name: 1 });
        res.json({ success: true, data: stands });
    } catch (error) {
        console.error('Error al listar stands:', error);
        res.status(500).json({ success: false, message: 'No se pudieron obtener los stands.' });
    }
};