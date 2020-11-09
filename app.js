const express = require("express");
const app = express();
const weatherRouter = require("./routes/weather");

app.use(weatherRouter.router);
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(5000, () => {
  console.log("server is at 5000");
});
