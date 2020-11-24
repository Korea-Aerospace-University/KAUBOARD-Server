const path = require("path");
const express = require("express");
const app = express();
const http = require("http");
const notiRouter = require("./routes/notification");
const weatherRouter = require("./routes/weather");
const scheduleRouter = require("./routes/schedule");
const quoteRouter = require("./routes/quotes");
const versionRouter = require("./routes/checkVersion");
const cors = require("cors");

app.use(cors());
app.use(weatherRouter.router);
app.use(notiRouter.router);
app.use(scheduleRouter.router);
app.use(quoteRouter.router);
app.use(versionRouter.router);
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`server is at ${process.env.PORT}`);
});

startKeepAlive();

function startKeepAlive() {
  setInterval(function () {
    const options = {
      host: "https://calm-mesa-43659.herokuapp.com/weather",
      port: 80,
      path: "/",
    };
    http
      .get(options, function (res) {
        res.on("data", function (chunk) {
          try {
            // optional logging... disable after it's working
            console.log("HEROKU RESPONSE: " + chunk);
          } catch (err) {
            console.log(err.message);
          }
        });
      })
      .on("error", function (err) {
        console.log("Error: " + err.message);
      });
  }, 20 * 60 * 1000); // load every 20 minutes
}
