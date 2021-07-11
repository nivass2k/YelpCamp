const express = require("express");
const router = express.Router();
const catchAsync = require("../util/catchAsync");
const campgrounds = require("../controllers/campgrounds");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const multer=require("multer");
const {storage}=require('../cloudinary');
const upload=multer({storage});



router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(isLoggedIn, upload.array('image'), validateCampground,catchAsync(campgrounds.created));


router.get("/add", isLoggedIn, campgrounds.create);

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCamp))
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp))
  .put(isAuthor,upload.array('image'), validateCampground,catchAsync(campgrounds.updateCamp));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.editCamp));

module.exports = router;
