const express = require("express");
const path = require("path");
const uploadImages = express.Router();

uploadImages.get("/images/:path", async (req, res, next) => {
  res.sendFile(path.join(__dirname, "../uploads/images/", req.params.path));
});

module.exports = uploadImages;
