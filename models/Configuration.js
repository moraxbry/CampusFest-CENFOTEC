const mongoose = require('mongoose');
const { Schema } = mongoose;

const homeSchema = new Schema(
  {
    title: { type: String, default: 'Bienvenido a CampusFest' },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const contactSchema = new Schema(
  {
    title: { type: String, default: 'Contáctanos' },
    description: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
  },
  { _id: false }
);

/**
 * Colección de un solo documento: solo existen dos secciones fijas de
 * contenido dinámico (inicio y contacto), que se editan por separado
 * pero rara vez crecen en cantidad.
 */
const configurationSchema = new Schema({
  home: { type: homeSchema, default: () => ({}) },
  contact: { type: contactSchema, default: () => ({}) },
});

module.exports = mongoose.model('Configuration', configurationSchema);
