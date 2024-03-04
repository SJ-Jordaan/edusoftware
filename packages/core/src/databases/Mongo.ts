import mongoose from 'mongoose';
import { Config } from 'sst/node/config';

let connection: mongoose.Mongoose | null = null;
type ExtendedConfig = typeof Config & { MONGO_URI?: string };

export async function connectToDatabase() {
  if (connection === null) {
    const mongoUri = (Config as ExtendedConfig).MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI not set');
    }

    connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
  }

  if (!connection) {
    throw new Error('Failed to connect to database');
  }

  console.log('Connected to database');

  return connection;
}
