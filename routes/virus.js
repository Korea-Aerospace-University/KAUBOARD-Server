const express = require("express");
const axios = require("axios");
const router = express.Router();

let seoul = [];
let gyeonggi = [];
// temp 값으로는 빌드일의 확진자수 적어주기
let seoulTemp = 122;
let gyeonggiTemp = 116;

let seoulBefore = 148;
let gyeonggiBefore = 160;
// temp값과 before값의 차이
let seoulDiff = { diff: "decrease", count: 26 };
let gyeonggiDiff = { diff: "decrease", count: 44 };

const host = "https://api.corona-19.kr/korea/country/new";
const serviceKey = "serviceKey=sJrgb8qWVz9IkdtxTvMwRmXnFLZ2PKU14";

const getVirusData = async () => {
  const virusInfo = await axios.get(`${host}?${serviceKey}`);

  seoul = virusInfo.data.seoul;
  gyeonggi = virusInfo.data.gyeonggi;

  if (Number(seoul.newCase) !== seoulTemp) {
    seoulBefore = seoulTemp;
    seoulTemp = Number(seoul.newCase);
  }
  if (Number(gyeonggi.newCase) !== gyeonggiTemp) {
    gyeonggiBefore = gyeonggiTemp;
    gyeonggiTemp = Number(gyeonggi.newCase);
  }

  if (Number(seoul.newCase) - seoulBefore !== 0) {
    if (Number(seoul.newCase) - seoulBefore > 0) {
      seoulDiff = {
        diff: "increase",
        count: Math.abs(Number(seoul.newCase) - seoulBefore),
      };
    } else {
      seoulDiff = {
        diff: "decrease",
        count: Math.abs(Number(seoul.newCase) - seoulBefore),
      };
    }
  } else {
    seoulDiff = { diff: "unchanged", count: 0 };
  }
  if (Number(gyeonggi.newCase) - gyeonggiBefore !== 0) {
    if (Number(gyeonggi.newCase) - gyeonggiBefore > 0) {
      gyeonggiDiff = {
        diff: "increase",
        count: Math.abs(Number(gyeonggi.newCase) - gyeonggiBefore),
      };
    } else {
      gyeonggiDiff = {
        diff: "decrease",
        count: Math.abs(Number(gyeonggi.newCase) - gyeonggiBefore),
      };
    }
  } else {
    seoulDiff = { diff: "unchanged", count: 0 };
  }
};

getVirusData();

// 1시간마다 업데이트36000000
setInterval(getVirusData, 3600000);
router.get("/virus", (req, res) => {
  res.send({ seoul, gyeonggi, seoulDiff, gyeonggiDiff });
});

module.exports = { router };
