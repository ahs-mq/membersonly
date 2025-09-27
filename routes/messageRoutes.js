const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.get("/", messageController.getHome);
router.post("/addmsg", messageController.addMessage);

module.exports = router;
