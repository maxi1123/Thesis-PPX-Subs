import * as streamsService from "../services/streams.service.js";

async function get(_req, res) {
  try {
    const result = await streamsService.getStreamList();
    res.json(result);
  } catch (err) {
    console.error(`Error `, err.message);
    res.status(400).send("Error getting channel list!");
  }
}

async function getStreamUrl(req, res) {
  try {
    if (req.body.channelId === undefined) {
      throw new Error("Faulty JSON!");
    }
    const result = await streamsService.getStreamUrl(req.body.channelId);
    res.json(result);
  } catch (err) {
    console.error(`Error `, err.message);
    res.status(400).send("Error getting stream URL!");
  }
}

export { get, getStreamUrl };
