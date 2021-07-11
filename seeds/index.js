const mongoose = require("mongoose");
const cities = require("./indianCities");
const campground = require("../models/campground");
const { places, descriptors } = require("./seedhelpers");
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const sample=array=>array[Math.floor(Math.random()*array.length)]

const seedDB = async () => {
  await campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 50);
    const price= Math.floor(Math.random()*20)+10;
    const camp = new campground({
      location: `${cities[random1000].City},${cities[random1000].State}`,
      title:`${sample(descriptors)} ${sample(places)}`,
      geometry:{
        type:"Point",
        coordinates:[cities[random1000].Longitude,cities[random1000].Latitude]
      },
      images:[
        {
          url: 'https://res.cloudinary.com/nivas-yelpcamp/image/upload/v1625843539/Yelpcamp/wsdf4gzerllwxmzixt6t.jpg',
          filename: 'Yelpcamp/wsdf4gzerllwxmzixt6t'
        },
        {
          url: 'https://res.cloudinary.com/nivas-yelpcamp/image/upload/v1625843541/Yelpcamp/g0vcef5jpgnojpe6fvgt.jpg',
          filename: 'Yelpcamp/g0vcef5jpgnojpe6fvgt'
        }],
      description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt consequatur laborum unde facilis labore, deserunt obcaecati, aut harum fugiat, at alias suscipit. Quis aliquam numquam, voluptatem tempore obcaecati ad earum?',
      price,
      author:'60e5eac25122a45694c3c15c'
    });

    await camp.save();
  }
};

seedDB().then(()=>{mongoose.connection.close()});
