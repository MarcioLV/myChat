const express = require("express")
const multer = require("multer");

const response = require("../../network/response")
const controller = require("./controller")
const {sendMessage} = require("../../socket")


const router = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/server/public/files/pictures");
  },
  filename: function (req, file, cb) {
    const [name, extension] = file.originalname.split(".");
    cb(null, `${name}-${Date.now()}.${extension}`);
  },
});

const upload = multer({
  storage: storage,
});

router.post("/", upload.single("picture"), (req, res, next) => {
  controller
    .addMessage(req.body.chat, req.body.user, req.body.message, req.file)
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

router.post("/:id", (req, res, next) => {
  controller
    .getMessages(req.params.id, req.body.userId)
    .then((data) => {
      response.success(req, res, data, 200)
    })
    .catch(next)
})

router.put("/:id", (req, res, next) => {
  controller
    .updateMessage(req.params.id)
    .then((data) => {
      response.success(req, res, data, 200)
    })
    .catch(next)
})

module.exports = router