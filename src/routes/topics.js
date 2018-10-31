const express = require("express");
const router = express.Router();
const topicController = require("../controllers/topicController");
const validation = require("./validation");

router.get("/topics", topicController.index);
router.get("/topics/new", topicController.new);
router.post("/topics/create", validation.validateTopics, topicController.create);

module.exports = router;
