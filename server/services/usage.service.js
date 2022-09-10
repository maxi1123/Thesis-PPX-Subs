import ethers from "ethers";
import * as dbo from "../db/conn.js";
import * as web3 from "../web3/conn.js";

let dbConnect;

const setDb = () => {
  dbConnect = dbo.getDb();
};

// get all documents
const getDocuments = () => {
  return dbConnect.collection("usage").find({}).toArray();
};

// post initial subscription to database
const addDocument = (subscriptionId, usage = 0, debtor, payee, start, end) => {
  const usageDocument = {
    subscription_id: subscriptionId,
    usage: usage,
    debtor: debtor,
    payee: payee,
    createdAt: start,
    expiresAt: end,
    status: "ACTIVE",
  };
  return dbConnect.collection("usage").insertOne(usageDocument);
};

// delete subscription from database
const deleteDocument = (subscriptionId) => {
  const listingQuery = { subscription_id: subscriptionId };
  return dbConnect.collection("usage").deleteOne(listingQuery);
};

// @calledBy Database
// post usage to oracle
const postToOracle = async (debtor, payee, usage) => {
  const address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const abi = [
    "function setUsage(address debtor, address payee, uint256 usage) public",
  ];
  const contract = new ethers.Contract(address, abi, web3.getSigner());
  console.log(await web3.getSigner().getAddress());
  console.log(payee, usage);

  return "$numberLong" in usage
    ? contract.setUsage(debtor, payee, Number(usage["$numberLong"]))
    : contract.setUsage(debtor, payee, Number(usage["$numberInt"]));
};

// increases usage counter
const updateUsage = (subscriptionId) => {
  const listingQuery = { subscription_id: subscriptionId };
  const updates = {
    $inc: {
      usage: 1,
    },
  };

  return dbConnect.collection("usage").updateOne(listingQuery, updates);
};

const terminateSubscription = (debtor, payee) => {
  const address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const abi = [
    "function terminateSubscription(address debtor, address payee) external",
  ];
  const contract = new ethers.Contract(address, abi, web3.getSigner());
  return contract.terminateSubscription(debtor, payee);
};

export {
  getDocuments,
  addDocument,
  postToOracle,
  updateUsage,
  deleteDocument,
  setDb,
  terminateSubscription,
};
