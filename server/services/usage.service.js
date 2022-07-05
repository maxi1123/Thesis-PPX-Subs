import ethers from 'ethers';
import * as dbo from '../db/conn.js';
import * as web3 from '../web3/conn.js';

let dbConnect;

const setDb = () => {
  dbConnect = dbo.getDb();
};

const getDocuments = () => {
  return dbConnect.collection('usage').find({}).toArray();
};

const addDocument = (subscriptionId, parentContract, usage = 0, start, end) => {
  const usageDocument = {
    subscription_id: subscriptionId,
    parent_contract: parentContract,
    usage: usage,
    createdAt: start,
    expiresAt: end,
  };
  return dbConnect.collection('usage').insertOne(usageDocument);
};

const deleteDocument = (subscriptionId) => {
  const listingQuery = { subscription_id: subscriptionId };
  return dbConnect.collection('usage').deleteOne(listingQuery);
};

const postToOracle = async (subscriptionAddress, usage) => {
  const address = '0x077530692a3f45Ff0C7b062699B96f67DA5c643E';
  const abi = [
    'function setUsage(address userSubscription, uint256 usage) public',
  ];
  const contract = new ethers.Contract(address, abi, web3.getSigner());
  console.log(await web3.getSigner().getAddress());
  console.log(subscriptionAddress, usage);
  const intUsage = Number(usage);
  return contract.setUsage(subscriptionAddress, intUsage);
};

const updateUsage = (subscriptionId) => {
  const listingQuery = { subscription_id: subscriptionId };
  const updates = {
    $inc: {
      usage: 1,
    },
  };

  return dbConnect.collection('usage').updateOne(listingQuery, updates);
};

export {
  getDocuments,
  addDocument,
  postToOracle,
  updateUsage,
  deleteDocument,
  setDb,
};
