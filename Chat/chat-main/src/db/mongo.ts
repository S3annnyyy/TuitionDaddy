import { Collection, MongoClient } from "mongodb";

const mongoUrl = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;

let db, messagesCollection: Collection, sessionsCollection: Collection;

async function connectToMongo() {
  try {
    if (!mongoUrl) {
      throw new Error("MongoDB URL is not defined");
    }
    if (!dbName) {
      throw new Error("Database name is not defined");
    }

    const client = new MongoClient(mongoUrl);
    await client.connect();
    console.log("Connected successfully to MongoDB server");
    db = client.db(dbName);
    messagesCollection = db.collection("messages");
    sessionsCollection = db.collection("sessions");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

export { connectToMongo, messagesCollection, sessionsCollection };
