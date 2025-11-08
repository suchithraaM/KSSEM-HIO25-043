// config.js - fallback to in-memory mongo for local dev if MONGO_URI is not set
const mongoose = require('mongoose');

async function startInMemoryMongo() {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log('⚠️ Using in-memory MongoDB for dev at', uri);
  return { uri, mongod };
}

const connectDB = async () => {
  try {
    console.log("🧠 Connecting to MongoDB...");
    let mongoUri = process.env.MONGO_URI;
    let mongod;
    if (!mongoUri) {
      // start in-memory mongo
      const res = await startInMemoryMongo();
      mongoUri = res.uri;
      mongod = res.mongod;
      // note: keep `mongod` reference if you want to stop it later
    }
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
