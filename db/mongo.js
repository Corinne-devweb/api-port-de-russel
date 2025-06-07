// db/mongo.js

const mongoose = require("mongoose");

const clientOptions = {
  dbName: "russel",
};

const initClientDbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, clientOptions);
  } catch (error) {
    console.error("Erreur de connexion à MongoDB :", error);
    throw error;
  }
};

module.exports = initClientDbConnection;
