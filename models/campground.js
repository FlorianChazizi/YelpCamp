const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png



const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})


const opts = { toJSON: { virtuals: true } };


const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'], // we want Always "Point" input
            required: true
        },
        coordinates: {
            type: [Number],  // A string of number eg[ 250, 520]
            required: true
        }
    }
}, opts);


CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}"> ${this.title} </a> </strong>
            <p> ${this.description.substring(0,20)}...  </p>`;
});


CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('Campground', CampgroundSchema);