const express = require("express");
const router = express.Router({mergeParams:true});
const review=require("../models/review");
const campground = require("../models/campground");
const catchAsync = require("../util/catchAsync");
const { isLoggedIn,isReviewed,validateReview } = require("../middleware");
const reviews=require("../controllers/reviews")

router.post("/", isLoggedIn,validateReview,catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",isLoggedIn,isReviewed,
  catchAsync(reviews.deleteReview)
);

module.exports=router;