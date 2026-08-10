const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Se referencia (no se embebe) a Activity porque es una relación 1 a muchos
 * sin límite conocido: una actividad puede tener cientos de inscritos.
 */
const inscriptionSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    idNumber: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'El correo electrónico no tiene un formato válido'],
    },
    phone: { type: String, required: true, trim: true },
    major: { type: String, required: true, trim: true },
    activity: { type: Schema.Types.ObjectId, ref: 'Activity', required: true },
    comments: { type: String, default: '' },
    status: {
      type: String,
      enum: ['confirmed', 'waitlisted'],
      default: 'confirmed',
    },
    waitlistPosition: { type: Number, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Evita que un mismo correo se inscriba dos veces a la misma actividad (RF-16)
inscriptionSchema.index({ email: 1, activity: 1 }, { unique: true });

module.exports = mongoose.model('Inscription', inscriptionSchema);
