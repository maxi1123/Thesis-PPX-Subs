import * as usageService from "../services/usage.service.js";

async function get(_req, res) {
  try {
    const result = await usageService.getDocuments();
    res.json(result);
  } catch (err) {
    console.error(`Error `, err.message);
    res.status(400).send("Error getting usage documents!");
  }
}

async function post(req, res) {
  try {
    if (
      req.body.subscriptionId == undefined ||
      req.body.usage == undefined ||
      req.body.debtor == undefined ||
      req.body.payee == undefined ||
      req.body.createdAt == undefined ||
      req.body.expiresAt == undefined
    ) {
      throw new Error("Faulty JSON!");
    }
    const result = await usageService.addDocument(
      req.body.subscriptionId,
      req.body.usage,
      req.body.debtor,
      req.body.payee,
      req.body.createdAt,
      req.body.expiresAt
    );
    console.log(`Added a new usage document with id ${result.insertedId}`);
    res.status(204).send();
  } catch (err) {
    console.error(`Error `, err.message);
    res.status(400).send("Error inserting usage document!");
  }
}

async function deleteEntry(req, res) {
  try {
    if (req.body.subscriptionId == undefined) {
      throw new Error("Faulty JSON!");
    }
    await usageService.deleteDocument(req.body.subscriptionId);
    console.log("Document deleted!");
    res.status(204).send();
  } catch (err) {
    console.error(`Error `, err.message);
    res.status(400).send("Error deleting document!");
  }
}

async function postToOracle(req, res) {
  try {
    if (
      req.body.debtor == undefined ||
      req.body.payee == undefined ||
      req.body.usage == undefined
    ) {
      throw new Error("Faulty JSON!");
    }
    const tx = await usageService.postToOracle(
      req.body.debtor,
      req.body.payee,
      req.body.usage
    );
    console.log(`Posted to Oracle!`);
    console.log(tx);
    res.status(204).send();
  } catch (err) {
    console.error(`Error `, err.message);
    res.status(400).send("Error posting to Oracle!");
  }
}

async function postUsage(req, res) {
  try {
    if (req.body.subscriptionId == undefined) {
      throw new Error("Faulty JSON!");
    }
    await usageService.updateUsage(req.body.subscriptionId);
    console.log(`Updated usage in document!`);
    res.status(204).send();
  } catch (err) {
    console.error(`Error `, err.message);
    res.status(400).send("Error updating usage in document!");
  }
}

async function terminateSubscription(req, res) {
  try {
    if (
      req.body.debtor == undefined ||
      req.body.payee == undefined
    ) {
      throw new Error("Faulty JSON!");
    }
    await usageService.terminateSubscription(
      req.body.debtor,
      req.body.payee
    );
    console.log(`Terminated Subscription!`);
    res.status(204).send();
  } catch (err) {
    console.error(`Error `, err.message);
    res.status(400).send("Error terminating Subscription!");
  }
}

export { get, post, postToOracle, postUsage, deleteEntry, terminateSubscription };
