const Inscription = require('../models/Inscription');
const Activity = require('../models/Activity');

// POST /api/inscriptions
exports.createInscription = async (req, res) => {
    try {
        const { activity: activityId } = req.body;

        const activity = await Activity.findById(activityId);
        if (!activity) {
        return res.status(404).json({ success: false, message: 'La actividad seleccionada no existe.' });
        }
        if (activity.status === 'cancelled') {
        return res.status(400).json({
            success: false,
            message: 'Esta actividad fue cancelada y ya no acepta inscripciones.',
        });
        }

        const isFull = activity.takenSpots >= activity.maxCapacity;
        let status = 'confirmed';
        let waitlistPosition = null;

        if (isFull) {
        status = 'waitlisted';
        const waitlistCount = await Inscription.countDocuments({
            activity: activityId,
            status: 'waitlisted',
        });
        waitlistPosition = waitlistCount + 1;
        }

        const inscription = await Inscription.create({ ...req.body, status, waitlistPosition });

        if (!isFull) {
        activity.takenSpots += 1;
        if (activity.takenSpots >= activity.maxCapacity) {
            activity.status = 'full';
        }
        await activity.save();
        }

        res.status(201).json({ success: true, data: inscription, waitlisted: isFull });
    } catch (error) {
        if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: 'Este correo ya está inscrito en esta actividad.',
        });
        }
        if (error.name === 'ValidationError') {
        return res.status(400).json({ success: false, message: 'Datos de inscripción inválidos.' });
        }
        console.error('Error al crear inscripción:', error);
        res.status(500).json({ success: false, message: 'No se pudo procesar la inscripción.' });
    }
};