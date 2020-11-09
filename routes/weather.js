const path = require("path");
const express = require("express");
const axios = require("axios");
const rootDir = require("../util/path");
const router = express.Router();

let current = {};
let weekly = [];

setInterval(
  (function fetchWeather() {
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/onecall?lat=37.599361&lon=126.865111&exclude=minutely,hourly,alerts&lang=kr&appid=5910598935c677e814cca7ad9d3afa8e"
      )
      .then((res) => {
        current = { ...res.data.current };
        weekly = [...res.data.daily];
        console.log("current: ", current.weather);
        console.log("weekly: ", weekly);
      });
    return fetchWeather;
  })(),
  600000
  // 10분마다 날씨 정보 fetch
);

router.get("/weather", (req, res) => {
  console.log("weather");
  res.send(current);
});

module.exports = { router };
