const express = require("express")

const response = require("../../network/response")
const controller = require("./controller")
const {sendMessage} = require("../../socket")


const router = express.Router()

router.post("/", (req, res, next) => {
  controller
    .addMessage(req.body.chat, req.body.user, req.body.message)
    .then((data) => {
      response.success(req, res, data.data, 201)
      sendMessage(req.body.userTo, data.message)
    })
    .catch(next)
})

router.get("/", (req, res, next) => {
  controller
    .list()
    .then((data) => {
      response.success(req, res, data, 200)
    })
    .catch(next)
})

router.get("/:id", (req, res, next) => {
  controller
    .getMessages(req.params.id)
    .then((data) => {
      response.success(req, res, data, 200)
    })
    .catch(next)
})

module.exports = router