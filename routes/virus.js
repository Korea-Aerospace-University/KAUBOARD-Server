const express = require("express");
const axios = require("axios");
const router = express.Router();

let seoul = [];
let gyeonggi = [];

const host = "https://api.corona-19.kr/korea/country/new";
const serviceKey = "serviceKey=sJrgb8qWVz9IkdtxTvMwRmXnFLZ2PKU14";

const getVirusData = async () => {
  const virusInfo = await axios.get(`${host}?${serviceKey}`);
  seoul = virusInfo.data.seoul;
  gyeonggi = virusInfo.data.gyeonggi;
};

getVirusData();

setInterval(getVirusData, 10800000);

router.get("/virus", (req, res) => {
  res.send({ seoul, gyeonggi });
});

module.exports = { router };
