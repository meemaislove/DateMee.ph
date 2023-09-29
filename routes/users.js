const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");

const User = require("../models/user");

const { storeReturnTo } = require("../middleware");

const ExpressError = require("../utils/Express.Error");
const catchAsync = require("../utils/catchAsync");

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);

module.exports = router;
