import ethers from "ethers";
import * as dbo from "../db/conn.js";
import * as web3 from "../web3/conn.js";

let dbConnect;

const setDb = () => {
  dbConnect = dbo.getDb();
};

const getDocuments = () => {
  return dbConnect.collection("usage").find({}).toArray();
};

const addDocument = (subscriptionId, usage = 0, debtor, payee, start, end) => {
  const usageDocument = {
    subscription_id: subscriptionId,
    usage: usage,
    debtor: debtor,
    payee: payee,
    createdAt: start,
    expiresAt: end,
  };
  return dbConnect.collection("usage").insertOne(usageDocument);
};

const deleteDocument = (subscriptionId) => {
  const listingQuery = { subscription_id: subscriptionId };
  return dbConnect.collection("usage").deleteOne(listingQuery);
};

const postToOracle = async (debtor, payee, usage) => {
  const address = "0x077530692a3f45Ff0C7b062699B96f67DA5c643E";
  const abi = [
    "function setUsage(address debtor, address payee, uint256 usage) public",
  ];
  const contract = new ethers.Contract(address, abi, web3.getSigner());
  console.log(await web3.getSigner().getAddress());
  console.log(subscriptionAddress, usage);
  const intUsage = Number(usage);
  return contract.setUsage(debtor, payee, intUsage);
};

const updateUsage = (subscriptionId) => {
  const listingQuery = { subscription_id: subscriptionId };
  const updates = {
    $inc: {
      usage: 1,
    },
  };

  return dbConnect.collection("usage").updateOne(listingQuery, updates);
};

export {
  getDocuments,
  addDocument,
  postToOracle,
  updateUsage,
  deleteDocument,
  setDb,
};
