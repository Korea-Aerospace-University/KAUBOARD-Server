const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");

let curMonth = new Date().getMonth();
let curScheduleList = [];
let semester = [1, 2];
let month = [1, 2, 3, 4, 5, 6, 7];

const getSchedule = async (semester, month) => {
  try {
    return await axios({
      url: `http://www.kau.ac.kr/academicinfo/cms/term_0${semester}_0${month}.htm`,
      method: "get",
      responseType: "arraybuffer",
    });
  } catch (err) {
    console.log(err);
  }
};

getSchedule(Math.floor(curMonth / 7) + 1, (curMonth % 7) + 1).then((res) => {
  let decoded = iconv.decode(res.data, "EUC-KR");
  let scheduleList = [];
  const $ = cheerio.load(decoded);
  for (let i = 0; i <= 12; i += 2) {
    scheduleList = [
      ...scheduleList,
      $(
        `body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(${i}) > td`
      )
        .text()
        .trim(),
    ];
  }
  curScheduleList = scheduleList.filter((el) => el);
});

setInterval(() => {
  getSchedule(Math.floor(curMonth / 7) + 1, (curMonth % 7) + 1).then((res) => {
    let decoded = iconv.decode(res.data, "EUC-KR");
    let scheduleList = [];
    const $ = cheerio.load(decoded);
    for (let i = 0; i <= 12; i += 2) {
      scheduleList = [
        ...scheduleList,
        $(
          `body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(${i}) > td`
        )
          .text()
          .trim(),
      ];
    }
    curScheduleList = scheduleList.filter((el) => el);
  });
}, 86400000);

router.get("/schedule", (req, res) => {
  res.send({ scheduleList: curScheduleList });
});

module.exports = { router };
