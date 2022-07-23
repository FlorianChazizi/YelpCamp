const mongoose = require('mongoose');   // Load MongoDB
const Campground = require('../models/campground'); // Load Schema
const cities = require('./cities'); // Load cities.js
const {places, descriptors} = require('./seedHelpers'); // Load seedHelpers.js

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});    // Connect to Database yelp-camp

const db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database Connected");
})

const sample = array => array[Math.floor(Math.random() * array.length)]; // Generates a random number related with array length


const seedDB = async () => {
    await Campground.deleteMany({});
    
    for(let i = 0; i < 10; i++){
        const price = Math.floor(Math.random() * 20) + 10;
        const random20 = Math.floor(Math.random() * 10);
        const camp = new Campground({
            author: '62cc91ba08990c19beed811b',
            location: `${cities[random20].city}`,
            title: `${sample(descriptors)} ${sample(places)}`, 
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat temporibus minus similique saepe illo iure recusandae tempore. Libero repudiandae, minus error adipisci aperiam nostrum, at nam excepturi unde, assumenda doloremque.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random20].longtitude,
                    cities[random20].latitute,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/florian-cloud/image/upload/v1657998614/YelpCamp/f0ww8mmweegaxuutpryg.jpg',
                    filename: 'YelpCamp/f0ww8mmweegaxuutpryg'
                  },
                  {
                    url: 'https://res.cloudinary.com/florian-cloud/image/upload/v1657998618/YelpCamp/iu9ljlgrdwbox6mcr4ka.jpg',
                    filename: 'YelpCamp/iu9ljlgrdwbox6mcr4ka'
                  }

            ]
       
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})