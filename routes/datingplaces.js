const express = require("express");
const router = express.Router();
const datingplaces = require("../controllers/datingplaces");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const Datingplace = require("../models/datingplace");

const { isLoggedIn, validateDatingplace, isAuthor } = require("../middleware");

const catchAsync = require("../utils/catchAsync");

router
  .route("/")
  .get(catchAsync(datingplaces.index))
  .post(
    isLoggedIn,
    upload.array("datingplace[images]"),
    validateDatingplace,
    catchAsync(datingplaces.createDatingplace)
  );

router.route("/new").get(isLoggedIn, datingplaces.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(datingplaces.showDatingplace))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("datingplace[images]"),
    validateDatingplace,
    catchAsync(datingplaces.updateDatingplace)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(datingplaces.deleteDatingplace));

module.exports = router;

router
  .route("/:id/edit")
  .get(isLoggedIn, isAuthor, catchAsync(datingplaces.renderEditForm));
