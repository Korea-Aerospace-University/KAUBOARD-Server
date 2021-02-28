const express = require("express");
const axios = require("axios");
const router = express.Router();

let seoul = [];
let gyeonggi = [];
// temp 값으로는 빌드일의 확진자수 적어주기
let seoulTemp = 120;
let gyeonggiTemp = 142;
let seoulDiff = { diff: "increase", count: 0 };
let gyeonggiDiff = { diff: "increase", count: 0 };

const host = "https://api.corona-19.kr/korea/country/new";
const serviceKey = "serviceKey=sJrgb8qWVz9IkdtxTvMwRmXnFLZ2PKU14";

const getVirusData = async () => {
  const virusInfo = await axios.get(`${host}?${serviceKey}`);

  seoul = virusInfo.data.seoul;
  gyeonggi = virusInfo.data.gyeonggi;

  if (Number(seoul.newCase) - seoulTemp !== 0) {
    if (Number(seoul.newCase) - seoulTemp > 0) {
      seoulDiff = {
        diff: "increase",
        count: Math.abs(Number(seoul.newCase) - seoulTemp > 0),
      };
    } else {
      seoulDiff = {
        diff: "decrease",
        count: Math.abs(Number(seoul.newCase) - seoulTemp > 0),
      };
    }
  }
  if (Number(gyeonggi.newCase) - gyeonggiTemp !== 0) {
    if (Number(gyeonggi.newCase) - gyeonggiTemp > 0) {
      gyeonggiDiff = {
        diff: "increase",
        count: Math.abs(Number(gyeonggi.newCase) - gyeonggiTemp > 0),
      };
    } else {
      gyeonggiDiff = {
        diff: "decrease",
        count: Math.abs(Number(gyeonggi.newCase) - gyeonggiTemp > 0),
      };
    }
  }
};

getVirusData();

// 3시간마다 업데이트
setInterval(getVirusData, 10800000);

router.get("/virus", (req, res) => {
  res.send({ seoul, gyeonggi, seoulDiff, gyeonggiDiff });
});

module.exports = { router };
