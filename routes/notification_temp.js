const path = require("path");
const express = require("express");
const notification = require("../util/crawler_old");
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

// 즉시 실행
getGeneralNoti().then((res) => {
  let tempGeneralNotiList = [];
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
    tempGeneralNotiList = [
      ...tempGeneralNotiList,
      {
        content: parseNoti(content.slice(0, content.lastIndexOf("-") - 8)),
        date: timeStamp,
      },
    ];
  }
  tempGeneralNotiList.sort((item1, item2) =>
    item1.date < item2.date ? 1 : -1
  );
  generalNotiList = tempGeneralNotiList;
});

getSchoolNoti().then((res) => {
  let tempSchoolNotiList = [];
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
    tempSchoolNotiList = [
      ...tempSchoolNotiList,
      {
        content: parseNoti(content.slice(0, content.lastIndexOf("-") - 8)),
        date: timeStamp,
      },
    ];
  }
  tempSchoolNotiList.sort((item1, item2) => (item1.date < item2.date ? 1 : -1));
  schoolNotiList = tempSchoolNotiList;
});

setInterval(() => {
  // 60초마다 학사공지 / 일반공지 읽어옴
  getGeneralNoti().then((res) => {
    let tempGeneralNotiList = [];
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
      tempGeneralNotiList = [
        ...tempGeneralNotiList,
        {
          content: parseNoti(content.slice(0, content.lastIndexOf("-") - 8)),
          date: timeStamp,
        },
      ];
    }
    tempGeneralNotiList.sort((item1, item2) =>
      item1.date < item2.date ? 1 : -1
    );
    generalNotiList = tempGeneralNotiList;
  });

  getSchoolNoti().then((res) => {
    let tempSchoolNotiList = [];
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
      tempSchoolNotiList = [
        ...tempSchoolNotiList,
        {
          content: parseNoti(content.slice(0, content.lastIndexOf("-") - 8)),
          date: timeStamp,
        },
      ];
    }
    tempSchoolNotiList.sort((item1, item2) =>
      item1.date < item2.date ? 1 : -1
    );
    schoolNotiList = tempSchoolNotiList;
  });
}, 3600000);

router.get("/notification", (req, res) => {
  res.send({
    schoolNotiList: schoolNotiList,
    generalNotiList: generalNotiList,
  });
});

module.exports = { router };
