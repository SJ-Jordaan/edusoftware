import { ApiHandler } from 'sst/node/api';
import * as mongodb from 'mongodb';

const MongoClient = mongodb.MongoClient;

// Once we connect to the database once, we'll store that connection
// and reuse it so that we don't have to connect to the database on every request.
let cachedDb: mongodb.Db | null = null;

async function connectToDatabase(database: string) {
  if (cachedDb) {
    return cachedDb;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  // Connect to our MongoDB database hosted on MongoDB Atlas
  const client = await MongoClient.connect(process.env.MONGODB_URI);

  // Specify which database we want to use
  cachedDb = client.db(database);

  return cachedDb;
}

export const handler = ApiHandler(async (_evt) => {
  return {
    statusCode: 200,
    body: 'Hello EduSoftware team!',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});
