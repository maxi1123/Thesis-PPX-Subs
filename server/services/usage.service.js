import * as dbo from "../db/conn.js";

const getDocuments = () => {
    const dbConnect = dbo.getDb();
    return dbConnect.collection("usage").find({}).limit(50).toArray();
};

const addDocument = (id, usage = 0) => {
    const dbConnect = dbo.getDb();
    const usageDocument = {
        subscription_id: id,
        usage: usage,
    };
    return dbConnect.collection("usage").insertOne(usageDocument);
};

export { getDocuments, addDocument };
