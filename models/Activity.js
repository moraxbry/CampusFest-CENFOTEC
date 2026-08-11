const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Subdocumento embebido: se embebe porque es una relación 1 a 1
 * con datos pequeños y fijos que siempre se consultan junto con la actividad.
 */
const resultSchema = new Schema(
  {
    firstPlace: { type: String, trim: true },
    secondPlace: { type: String, trim: true },
    thirdPlace: { type: String, trim: true },
    publishedAt: { type: Date },
  },
  { _id: false }
);

const activitySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    requirements: { type: String, default: '' },
    image: { type: String, default: '' },
    maxCapacity: { type: Number, required: true, min: 1 },
    takenSpots: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['available', 'full', 'cancelled'],
      default: 'available',
    },
    result: { type: resultSchema, default: null },
  },
  { timestamps: true } // crea createdAt y updatedAt automáticamente
);

module.exports = mongoose.model('Activity', activitySchema);
