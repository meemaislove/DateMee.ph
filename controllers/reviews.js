const Datingplace = require("../models/datingplace");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const datingplace = await Datingplace.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user.id;
  datingplace.reviews.push(review);
  await review.save();
  await datingplace.save();
  req.flash("success", "Created new review!");
  res.redirect(`/datingplaces/${datingplace.id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  await Datingplace.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully delete review!");
  res.redirect(`/datingplaces/${id}`);
};
