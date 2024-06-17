const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.listen(8080, function () {
  console.log("hello server");
});

app.get("/beauty", function (request, response) {
  response.send("뷰티용품을 쇼핑할 수 있는 페이지입니다.");
});

app.get("/pet", function (request, response) {
  response.send("pet을 쇼핑할 수 있는 페이지입니다.");
});

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.get("/write", function (request, response) {
  response.sendFile(__dirname + "/write.html");
});

app.post("/add", function (request, response) {
  response.send("send fin");
  console.log(request.body);
});
