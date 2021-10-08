const express = require("express")

const response = require("../../network/response")
const controller = require("./controller")

const router = express.Router()

router.get("/", (req, res) => {
  controller
    .list()
    .then((lista) => {
      response.success(req, res, lista, 200)
    })
})

router.get("/:search", (req, res) => {
  controller
    .getUser(req.params.search)
    .then((lista) => {
      response.success(req, res, lista, 200)
    })
})

router.post("/", (req, res) => {
  controller
    .addUser(req.body.name)
    .then((data) => {
      response.success(req, res, data, 201)
    })
    .catch((err)=> {
      response.error(req, res, "Internal Error", 500, err)
    })
})

// router.get("/:id", (req, res) => {
//   const user = req.query.name || null
//   controller
//     .getUser(user)
//     .then((userList) => {
//       response.success(req, res, userList, 200)
//     })
//     .catch((err) => {
//       response.error(req, res, "Unexpected Error", 500, err)
//     })
//   })

module.exports = router