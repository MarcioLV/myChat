const express = require("express");
const response = require("../../network/response");
const controller = require("./controller");

const router = express.Router();

router.get("/", (req, res, next) => {
  controller
    .list()
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch(next)
});

router.get("/:id", (req, res, next) => {
  controller
    .listChat(req.params.id)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch(next)
});

router.post("/", (req, res, next) => {
  controller
    .addChat(req.body)
    .then((data) => {
      response.success(req, res, data, 201);
    })
    .catch(next)
});

module.exports = router;
