const express = require("express")

const response = require("../../network/response")
const controller = require("./controller")

const router = express.Router()

router.get("/", (req, res) => {
  controller
    .list()
    .then((data) => {
      response.success(req, res, data, 200)
    })
    .catch((err) => {
      response.error(req, res, "Internal error", 500, err)
    })
})

router.get("/:id", (req, res) => {
  controller
    .listChat(req.params.id)
    .then((data) => {
      response.success(req, res, data, 200)
    })
    .catch(err => {
      response.error(req, res, "Internal error", 500, err)
    })
})

router.post("/", (req, res)=> {
  controller
    .addChat(req.body)
    .then((data) => {
      response.success(req, res, data, 201)
    })
    .catch((err) => {
      response.error(req, res, "Internal error", 500, err)
    })
})

module.exports = router