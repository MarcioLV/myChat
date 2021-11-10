const express = require("express")
const multer = require("multer")

const response = require("../../network/response")
const controller = require("./controller")

const router = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, 'src/server/public/files/avatars')
  },
  filename: function (req, file, cb){
    const [name, extension] = file.originalname.split(".");
    cb(null, `${name}-${Date.now()}.${extension}`)
  }
})

const upload = multer({
  storage: storage
})

router.get("/", (req, res, next) => {
  controller
    .list(req.query.name)
    .then((lista) => {
      response.success(req, res, lista, 200)
    })
    .catch(next)
})

router.get("/:search", (req, res, next) => {
  controller
    .getUser(req.params.search)
    .then((lista) => {
      response.success(req, res, lista, 200)
    })
    .catch(next)
})

router.post("/", (req, res, next) => {
  controller
    .addUser(req.body.name)
    .then((data) => {
      response.success(req, res, data, 201)
    })
    .catch(next)
})

router.post("/:user", upload.single("avatar"), (req,res, next) => {
  controller
    .addAvatar(req.params.user, req.file)
    .then((data) => {
      response.success(req, res, data, 201)
    })
    .catch(next)
})

module.exports = router