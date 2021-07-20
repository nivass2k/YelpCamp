const mongoose = require("mongoose");
const cities = require("./indianCities");
const campground = require("../models/campground");
const { places, descriptors } = require("./seedhelpers");
mongoose.connect("mongodb+srv://nivass2k:MongoDb@5445@cluster0.od4fw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
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
          url: 'https://res.cloudinary.com/nivas-yelpcamp/image/upload/v1626532765/Yelpcamp/b912btmzmvkswogft0f6.jpg',
          filename: 'Yelpcamp/wudogyikexbewyhnowxm'
        },
        {
          url: 'https://res.cloudinary.com/nivas-yelpcamp/image/upload/v1625995832/Yelpcamp/wudogyikexbewyhnowxm.jpg',
          filename: 'Yelpcamp/zswuzdfyr3pm7zvpdilq'
        }],
      description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt consequatur laborum unde facilis labore, deserunt obcaecati, aut harum fugiat, at alias suscipit. Quis aliquam numquam, voluptatem tempore obcaecati ad earum?',
      price,
      author:'60eaca5156b30f04286559c3'
    });

    await camp.save();
  }
};

seedDB().then(()=>{mongoose.connection.close()});
