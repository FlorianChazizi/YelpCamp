const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_COULD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({             // Save the photo on Cloudinary
    cloudinary,
    params: {
        folder: 'YelpCamp',                         // Save the photo in YelpCamp folder
        allowedFormats: [ 'jpeg', 'png', 'jpg']     // Save  these extensions
    }
});

module.exports = {
    cloudinary,
    storage
}