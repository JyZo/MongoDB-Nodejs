var router = require("express").Router();

router.get("/shop/shirts", function (request, response) {
  response.send("shirt!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
});

router.get("/shop/pants", function (request, response) {
  response.send("pants!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
});

module.exports = router;
