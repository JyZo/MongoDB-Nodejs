var router = require("express").Router();

function checkLogin(request, response, next) {
  if (request.user) {
    next();
  } else {
    response.send("not login");
  }
}

//모든 미들웨어를 router에 적용하는 법
router.use(checkLogin);
//특정 url에만 미들웨어 적용
router.use("/sports", checkLogin);

//위처럼 모든 미들웨어 적용을 하면 아래처럼 미들웨어를 하나씩 안넣어도됨
router.get("/sports", function (request, response) {
  response.send("sports!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
});

router.get("/game", checkLogin, function (request, response) {
  response.send("game!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
});

module.exports = router;
