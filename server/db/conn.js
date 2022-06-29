import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.ATLAS_URI;
const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let dbConnection;

const connectToServer = (callback) => {
    client.connect((err, db) => {
        if (err || !db) {
            return callback(err);
        }

        dbConnection = db.db('sample_analytics');
        console.log('Successfully connected to MongoDB.');

        return callback();
    });
};

const getDb = () => {
    return dbConnection;
};

export { connectToServer, getDb };
