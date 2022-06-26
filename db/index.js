const mongoose = require('mongoose');

const connectDB = () => {
  const DBURI = process.env.DB;

  try {
    mongoose.connect(DBURI);
  } catch (error) {
    console.error(error);
  }

  mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected to', mongoose.connection.db.databaseName);
  });
};

module.exports = connectDB;