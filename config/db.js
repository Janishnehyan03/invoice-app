const mongoose = require("mongoose");

async function connectDB(uri) {
  if (!uri) throw new Error("MONGO_URI missing.");
  await mongoose.connect(uri);
  console.log("MongoDB connected:", uri);
}

module.exports = connectDB;
