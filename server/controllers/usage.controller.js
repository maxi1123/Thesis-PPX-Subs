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
            req.body.usage == undefined
        ) {
            throw new Error("Faulty JSON!");
        }
        const result = await usageService.addDocument(
            req.body.subscriptionId,
            req.body.usage
        );
        console.log(`Added a new usage document with id ${result.insertedId}`);
        res.status(204).send();
    } catch (err) {
        console.error(`Error `, err.message);
        res.status(400).send("Error inserting usage document!");
    }
}

export { get, post };
