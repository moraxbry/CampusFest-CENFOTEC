const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conexión a MongoDB Atlas establecida correctamente.')
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB Atlas:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
