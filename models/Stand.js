const mongoose = require('mongoose');
const { Schema } = mongoose;

const standSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    owner: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stand', standSchema);
