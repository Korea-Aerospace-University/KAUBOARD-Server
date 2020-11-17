const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");

const getSchedule = async () => {
  try {
    return await axios({
      url: "http://www.kau.ac.kr/academicinfo/cms/term_01_01.htm",
      method: "get",
      responseType: "arraybuffer",
    });
  } catch (err) {
    console.log(err);
  }
};

getSchedule().then((res) => {
  let decoded = iconv.decode(res.data, "EUC-KR");
  const $ = cheerio.load(decoded);
  const event = $(
    `body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(${6}) > td`
  );
  console.log(event.text());
});
