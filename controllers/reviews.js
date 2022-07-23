const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async ( req,res ) => { // Create a Review based on ID user
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async( req, res ) => {// Delete a Review based on ID user
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}