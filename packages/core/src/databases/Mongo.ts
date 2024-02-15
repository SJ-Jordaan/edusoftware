import mongoose from 'mongoose';
import { Config } from 'sst/node/config';

let connection: mongoose.Mongoose | null = null;

export async function connectToDatabase() {
  if (connection === null) {
    if (!Config.MONGO_URI) {
      throw new Error('MONGO_URI not set');
    }

    connection = await mongoose.connect(Config.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  }

  if (!connection) {
    throw new Error('Failed to connect to database');
  }

  console.log('Connected to database');

  return connection;
}
