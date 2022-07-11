import Zattoo from "zattoo-unofficial-api";

const zattoo = new Zattoo({
  user: "qnnrihipmilplztqst@nthrl.com",
  password: "12345678",
  lang: "de", // optional
});

const getStreamList = async () => {
  let helper = new Array();
  const channels = await zattoo.getChannelList();
  helper = channels.channel_groups[0].channels.map((channel) => ({
    alias: channel.display_alias,
  }));
  console.log(helper);
  return helper;
};

const getStreamUrl = async (channelId) => {
  const streamUrl = await zattoo.getStreamUrls(channelId);
  return streamUrl[0].url;
};

export { getStreamList, getStreamUrl };
