const path = require("path");
const express = require("express");
const notification = require("../util/crawler");
const rootDir = require("../util/path");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");

let generalNotiList = [];
let schoolNotiList = [];

const parseNoti = (noti) => {
  if (
    isNaN(parseInt(noti.slice(0, 4))) ||
    parseInt(noti.slice(0, 4)) === new Date().getFullYear()
  ) {
    return noti;
  } else {
    return noti.slice(5);
  }
};

const getGeneralNoti = async () => {
  try {
    return await axios({
      url: "http://www.kau.ac.kr/page/kauspace/general_list.jsp",
      method: "GET",
      responseType: "arraybuffer",
    });
  } catch (err) {
    console.error(err);
  }
};

const getSchoolNoti = async () => {
  try {
    return await axios({
      url: "http://www.kau.ac.kr/page/kauspace/academicinfo_list.jsp",
      method: "GET",
      responseType: "arraybuffer",
    });
  } catch (err) {
    console.error(err);
  }
};

getGeneralNoti().then((res) => {
  let decoded = iconv.decode(res.data, "EUC-KR");
  const $ = cheerio.load(decoded);
  const notiTable = $("#board_form > div.board_list > table > tbody");
  for (let i = 0; i < notiTable.children().length; i++) {
    let content = notiTable
      .children()
      .eq(i)
      .text()
      .trim()
      .replace(/\s\s+/g, " ");

    let timeStamp = new Date(
      content.slice(
        content.lastIndexOf("-") - 7,
        content.lastIndexOf("-") + 3
      ) + " 12:00:00"
    ).getTime();
    generalNotiList = [
      ...generalNotiList,
      {
        content: parseNoti(content.slice(0, content.lastIndexOf("-") - 8)),
        date: timeStamp,
      },
    ];
  }
  generalNotiList.sort((item1, item2) => (item1.date < item2.date ? 1 : -1));
});

getSchoolNoti().then((res) => {
  let decoded = iconv.decode(res.data, "EUC-KR");
  const $ = cheerio.load(decoded);
  const notiTable = $("#board_form > div.board_list > table > tbody");
  for (let i = 0; i < notiTable.children().length; i++) {
    let content = notiTable
      .children()
      .eq(i)
      .text()
      .trim()
      .replace(/\s\s+/g, " ");

    let timeStamp = new Date(
      content.slice(
        content.lastIndexOf("-") - 7,
        content.lastIndexOf("-") + 3
      ) + " 12:00:00"
    ).getTime();
    schoolNotiList = [
      ...schoolNotiList,
      {
        content: parseNoti(content.slice(0, content.lastIndexOf("-") - 8)),
        date: timeStamp,
      },
    ];
  }
  schoolNotiList.sort((item1, item2) => (item1.date < item2.date ? 1 : -1));
});

router.get("/notification", (req, res) => {
  res.send({
    schoolNotiList: schoolNotiList,
    generalNotiList: generalNotiList,
  });
});

module.exports = { router };
