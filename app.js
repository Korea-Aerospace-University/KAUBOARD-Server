const path = require("path");
const express = require("express");
const app = express();
const http = require("http");
const notiRouter = require("./routes/notification_new");
const weatherRouter = require("./routes/weather");
const quoteRouter = require("./routes/quotes");
const versionRouter = require("./routes/checkVersion");
const virusRouter = require("./routes/virus");
const cors = require("cors");

app.use(cors());
app.use(weatherRouter.router);
app.use(notiRouter.router);
app.use(quoteRouter.router);
app.use(versionRouter.router);
app.use(virusRouter.router);
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
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
