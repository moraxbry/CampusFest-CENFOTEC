/**
 * Utilidad de mantenimiento: reinicia los datos de demostración a un estado
 * "limpio" — borra todas las inscripciones y deja las actividades como
 * disponibles y sin cupos ocupados, como si nadie se hubiera inscrito todavía.
 * No toca stands ni configuration (son contenido real del sitio, no datos
 * de inscripción de prueba).
 *
 * Uso: node scripts/reset-demo-data.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Activity = require('../models/Activity');
const Inscription = require('../models/Inscription');

async function resetDemoData() {
  await connectDB();

  const { deletedCount } = await Inscription.deleteMany({});
  console.log(`🗑️  Inscripciones eliminadas: ${deletedCount}`);

  const result = await Activity.updateMany(
    {},
    { $set: { status: 'available', takenSpots: 0, result: null } }
  );
  console.log(`♻️  Actividades reiniciadas a "disponible" y sin cupos: ${result.modifiedCount}`);

  await mongoose.connection.close();
  console.log('✅ Listo. Base de datos en estado limpio para demostración.');
}

resetDemoData().catch((error) => {
  console.error('Error al reiniciar los datos:', error);
  process.exit(1);
});
