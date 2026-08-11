const Configuration = require('../models/Configuration');

// GET /api/configuration
exports.getConfiguration = async (req, res) => {
  try {
    const configuration = (await Configuration.findOne()) || new Configuration();
    res.json({ success: true, data: configuration });
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ success: false, message: 'No se pudo obtener la configuración.' });
  }
};

// POST /api/contact
exports.sendContact = async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
    }

    console.log('📧 Nueva consulta de contacto (simulada):', { fullName, email, subject, message });

    res.json({ success: true, message: 'Tu consulta fue enviada correctamente. Te responderemos pronto.' });
  } catch (error) {
    console.error('Error al procesar contacto:', error);
    res.status(500).json({ success: false, message: 'No se pudo enviar tu consulta.' });
  }
};
