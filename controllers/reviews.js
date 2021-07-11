const review=require("../models/review");
const campground = require("../models/campground");
module.exports.createReview=async (req, res) => {
    const Campground = await campground.findById(req.params.id);
    const Review = new review(req.body.review);
    Review.author=req.user._id;
    Campground.reviews.push(Review);
    await Review.save();
    await Campground.save();
    req.flash('success','Thanks for submitting your review!');
    res.redirect(`/campgrounds/${Campground._id}`);
  }
  module.exports.deleteReview=async (req, res) => {
    await campground.findByIdAndUpdate(req.params.id, {
      $pull: { reviews: req.params.reviewId },
    });
    await review.findByIdAndDelete(req.params.reviewId);
    req.flash('success','Your review has been deleted');
    res.redirect(`/campgrounds/${req.params.id}`);
  }