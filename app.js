const path = require("path");
const express = require("express");
const app = express();
const notiRouter = require("./routes/notification");
const weatherRouter = require("./routes/weather");
const cors = require("cors");

app.use(cors());
app.use(weatherRouter.router);
app.use(notiRouter.router);
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`server is at ${process.env.PORT}`);
});
