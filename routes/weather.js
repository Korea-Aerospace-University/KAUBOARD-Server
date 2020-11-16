const path = require("path");
const express = require("express");
const axios = require("axios");
const rootDir = require("../util/path");
const router = express.Router();

let currentWeather = {};
let currentTemp = 0;
let perceptionTemp = 0;
let currentIcon = "";
let weeklyTemp = [];
let weeklyIcon = [];

setInterval(
  (function fetchWeather() {
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/onecall?lat=37.599361&lon=126.865111&units=metric&exclude=minutely,hourly,alerts&lang=kr&appid=5910598935c677e814cca7ad9d3afa8e"
      )
      .then((res) => {
        currentTemp = res.data.current.temp;
        perceptionTemp = res.data.current.feels_like;
        // 기본적으로 오늘부터 일주일간의 주간 일기예보를 제공
        // 내일부터 4일 (총 5일간) 의 정보 위해 배열 슬라이싱
        weeklyTemp = res.data.daily.slice(1, 6).map((el) => el.temp.day);
        weeklyIcon = res.data.daily
          .slice(1, 6)
          .map(
            (el) =>
              `http://openweathermap.org/img/wn/${el.weather[0].icon}@2x.png`
          );
        currentIcon = `http://openweathermap.org/img/wn/${res.data.current.weather[0].icon}@2x.png`;
      });
    return fetchWeather;
  })(),
  600000
  // 10분마다 날씨 정보 fetch
);

router.get("/weather", (req, res) => {
  res.send({
    currentTemp: currentTemp,
    perceptionTemp: perceptionTemp,
    currentIcon: currentIcon,
    weeklyTemp: weeklyTemp,
    weeklyIcon: weeklyIcon,
  });
});

module.exports = { router };
