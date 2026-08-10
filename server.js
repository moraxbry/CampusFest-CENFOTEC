require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const activitiesRoutes = require('./routes/activities');
const enrollmentsRoutes = require('./routes/enrollments');
const standsRoutes = require('./routes/stands');
const configurationRoutes = require('./routes/configuration');
const adminRoutes = require('./routes/admin');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos (CSS, JS del cliente, imágenes)
app.use(express.static('public'));

// Rutas de la API
app.use('/api/activities', activitiesRoutes);
app.use('/api/inscriptions', enrollmentsRoutes);
app.use('/api/stands', standsRoutes);
app.use('/api/configuration', configurationRoutes);
app.use('/api/admin', adminRoutes);

// Ruta de verificación rápida (health check)
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CampusFest API funcionando correctamente 🎉' });
});

// Middleware global de errores (RNF-18: sin exponer trazas técnicas al cliente)
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({
    success: false,
    message: 'Ocurrió un error inesperado. Por favor intenta de nuevo más tarde.',
  });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor CampusFest corriendo en http://localhost:${PORT}`);
  });
});
