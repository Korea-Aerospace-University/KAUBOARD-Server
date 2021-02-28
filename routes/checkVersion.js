const path = require("path");
const express = require("express");
const rootDir = require("../util/path");
const router = express.Router();

const currentVersion = "1.0.1";

router.get("/checkVersion", (req, res) => {
  res.send({
    currentVersion: currentVersion,
  });
});

module.exports = { router };
