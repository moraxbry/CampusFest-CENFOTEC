const Activity = require('../models/Activity');
const Inscription = require('../models/Inscription');
const Stand = require('../models/Stand');
const Configuration = require('../models/Configuration');

// --- Actividades ---

// POST /api/admin/activities
exports.createActivity = async (req, res) => {
    try {
        const activity = await Activity.create(req.body);
        res.status(201).json({ success: true, data: activity });
    } catch (error) {
        console.error('Error al crear actividad:', error);
        if (error.name === 'ValidationError') {
        return res.status(400).json({ success: false, message: 'Datos de actividad inválidos.' });
        }
        res.status(500).json({ success: false, message: 'No se pudo crear la actividad.' });
    }
};

// PUT /api/admin/activities/:id
exports.updateActivity = async (req, res) => {
    try {
        const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        });
        if (!activity) {
        return res.status(404).json({ success: false, message: 'Actividad no encontrada.' });
        }
        res.json({ success: true, data: activity });
    } catch (error) {
        console.error('Error al editar actividad:', error);
        res.status(500).json({ success: false, message: 'No se pudo editar la actividad.' });
    }
};

// DELETE /api/admin/activities/:id
exports.deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findByIdAndDelete(req.params.id);
        if (!activity) {
        return res.status(404).json({ success: false, message: 'Actividad no encontrada.' });
        }
        res.json({ success: true, message: 'Actividad eliminada correctamente.' });
    } catch (error) {
        console.error('Error al eliminar actividad:', error);
        res.status(500).json({ success: false, message: 'No se pudo eliminar la actividad.' });
    }
};

// PUT /api/admin/activities/:id/result
exports.publishActivityResult = async (req, res) => {
    try {
        const { firstPlace, secondPlace, thirdPlace } = req.body;
        const activity = await Activity.findByIdAndUpdate(
        req.params.id,
        { result: { firstPlace, secondPlace, thirdPlace, publishedAt: new Date() } },
        { new: true, runValidators: true }
        );
        if (!activity) {
        return res.status(404).json({ success: false, message: 'Actividad no encontrada.' });
        }
        res.json({ success: true, data: activity });
    } catch (error) {
        console.error('Error al publicar resultado:', error);
        res.status(500).json({ success: false, message: 'No se pudo publicar el resultado.' });
    }
};

// --- Inscripciones ---

// GET /api/admin/inscriptions
exports.getInscriptions = async (req, res) => {
    try {
        const { activity, status } = req.query;
        const filter = {};
        if (activity) filter.activity = activity;
        if (status) filter.status = status;

        const inscriptions = await Inscription.find(filter)
        .populate('activity', 'name date')
        .sort({ createdAt: -1 });

        res.json({ success: true, data: inscriptions });
    } catch (error) {
        console.error('Error al listar inscripciones:', error);
        res.status(500).json({ success: false, message: 'No se pudieron obtener las inscripciones.' });
    }
};

// PUT /api/admin/inscriptions/:id
exports.updateInscription = async (req, res) => {
    try {
        const inscription = await Inscription.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        });
        if (!inscription) {
        return res.status(404).json({ success: false, message: 'Inscripción no encontrada.' });
        }
        res.json({ success: true, data: inscription });
    } catch (error) {
        console.error('Error al modificar inscripción:', error);
        res.status(500).json({ success: false, message: 'No se pudo modificar la inscripción.' });
    }
};

// --- Stands ---

// POST /api/admin/stands
exports.createStand = async (req, res) => {
    try {
        const stand = await Stand.create(req.body);
        res.status(201).json({ success: true, data: stand });
    } catch (error) {
        console.error('Error al crear stand:', error);
        if (error.name === 'ValidationError') {
        return res.status(400).json({ success: false, message: 'Datos de stand inválidos.' });
        }
        res.status(500).json({ success: false, message: 'No se pudo crear el stand.' });
    }
};

// PUT /api/admin/stands/:id
exports.updateStand = async (req, res) => {
    try {
        const stand = await Stand.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        });
        if (!stand) {
        return res.status(404).json({ success: false, message: 'Stand no encontrado.' });
        }
        res.json({ success: true, data: stand });
    } catch (error) {
        console.error('Error al editar stand:', error);
        res.status(500).json({ success: false, message: 'No se pudo editar el stand.' });
    }
};

// --- Configuration ---

// PUT /api/admin/configuration/:section
exports.updateConfiguration = async (req, res) => {
    try {
        const { section } = req.params;
        if (!['home', 'contact'].includes(section)) {
        return res.status(400).json({ success: false, message: 'Sección de configuración inválida.' });
        }

        const configuration = await Configuration.findOneAndUpdate(
        {},
        { $set: { [section]: req.body } },
        { new: true, upsert: true, runValidators: true }
        );

        res.json({ success: true, data: configuration });
    } catch (error) {
        console.error('Error al editar configuración:', error);
        res.status(500).json({ success: false, message: 'No se pudo editar la configuración.' });
    }
};