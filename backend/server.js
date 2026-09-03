require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');

const hostname = '0.0.0.0';
const port = process.env.PORT || 3001;
const mongoUri = process.env.MONGO_URI;

async function startServer() {
  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in the backend .env file');
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}

startServer().catch((error) => {
  console.error('Unable to start server:', error.message);
  process.exit(1);
});