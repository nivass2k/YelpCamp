const express = require("express");
const router = express.Router();
const catchAsync=require('../util/catchAsync');
const passport=require('passport');
const User = require('../models/user');
const users=require("../controllers/users");

router.route("/register")
.get(users.getUser)
.post(catchAsync(users.registerUser));

router.route("/login")
.get(users.getLogin )
.post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}) ,users.authUser)

router.get('/logout',users.logOut)

module.exports = router;
