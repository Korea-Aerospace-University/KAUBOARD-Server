const express = require("express");
const axios = require("axios");
const router = express.Router();

let generalNotiList = [];
let schoolNotiList = [];
let tempGeneralNotiList = [];
let tempSchoolNotiList = [];

const compareByDate = (itemA, itemB) => {
  if (itemA.frstRegisterPnttm > itemB.frstRegisterPnttm) {
    return -1;
  } else return 1;
};

const getGeneralNoti = async () => {
  try {
    const res1 = await axios.post(
      "https://www.kau.ac.kr/web/bbs/bbsListApi.gen",
      {
        siteFlag: "www",
        bbsId: "0119",
        pageIndex: 1,
        bbsAuth: "30",
      }
    );
    tempGeneralNotiList = res1.data.resultList.map((el) => el);

    const res2 = await axios.post(
      "https://www.kau.ac.kr/web/bbs/bbsListApi.gen",
      {
        siteFlag: "www",
        bbsId: "0119",
        pageIndex: 2,
        bbsAuth: "30",
      }
    );
    tempGeneralNotiList = [
      ...tempGeneralNotiList,
      ...res2.data.resultList.map((el) => el),
    ];

    generalNotiList = tempGeneralNotiList
      .sort(compareByDate)
      .map((el) => el.nttSj)
      .slice(0, 5);
  } catch (err) {
    console.log(err);
  }
};

const getSchoolNoti = async () => {
  try {
    const res1 = await axios.post(
      "https://www.kau.ac.kr/web/bbs/bbsListApi.gen",
      {
        siteFlag: "www",
        bbsId: "0120",
        pageIndex: 1,
        bbsAuth: "30",
      }
    );
    schoolNotiList = res1.data.resultList.map((el) => el);

    const res2 = await axios.post(
      "https://www.kau.ac.kr/web/bbs/bbsListApi.gen",
      {
        siteFlag: "www",
        bbsId: "0120",
        pageIndex: 2,
        bbsAuth: "30",
      }
    );
    tempSchoolNotiList = [
      ...tempSchoolNotiList,
      ...res2.data.resultList.map((el) => el),
    ];

    schoolNotiList = tempSchoolNotiList
      .sort(compareByDate)
      .map((el) => el.nttSj)
      .slice(0, 5);
  } catch (error) {
    console.log(error);
  }
};

getSchoolNoti();
getGeneralNoti();

setInterval(() => {
  getSchoolNoti();
  getGeneralNoti();
}, 600000);

router.get("/notification", (req, res) => {
  res.send({
    schoolNotiList,
    generalNotiList,
  });
});

module.exports = { router };
