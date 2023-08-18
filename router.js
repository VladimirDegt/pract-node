const express = require("express");
const router = express.Router();
const { createFile, getFiles, getInfo } = require("./files");

router.post("/", createFile);
router.get("/", getFiles);
router.get("/:fileName", getInfo);

module.exports = router;
