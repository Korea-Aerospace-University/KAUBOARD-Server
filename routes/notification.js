const express = require("express");
const notification = require("../util/crawler_new");
const router = express.Router();

const { schoolNotiList, generalNotiList } = notification;

router.get("/notification", (req, res) => {
  res.send({
    schoolNotiList,
    generalNotiList,
  });
});

module.exports = { router };
