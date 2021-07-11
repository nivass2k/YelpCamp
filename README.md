# YelpCamp
My dark theme version of Colt Steele's Yelp Camp with changed UI and populated with Indian cities datasets. Fixed the bugs with session (due to recent update of connect-mongo)
You might have already come across Colt Steele's Yelp Camp project. If not I am going to describe it anyway please read through to get to know my version of this.

YelpCamp is inspired from yelp.com. YelpCamp is a web Application in which users can find campgrounds and review them. Users can also add their own campgrounds. A map has also 
been displayed for better searching. When a user enters a location, the map finds and shows it automatically. I have made the same project by making some tweaks and fixing 
some bugs. I have completely revamped the UI and made it into a dark mode for reducing eye strain. It is already populated with Indian cities. 
##Deployment
To see my Web Application please do visit https://yelpcamp-nivas.herokuapp.com/
## Specifications
   - Authentication
     - User can register and login
     - Used Passport for that purpose
   - Authorization
     - User needs to be logged in to make any change
     - A user can only alter his posts or reviews
   - Functionalities
     - Campgrounds are marked on a cluster map using Mapbox API
     - Images of campgrounds are uploaded to Cloudinary
     - Images can be added and deleted after creation of Campground
     - CRUD functions have been implemented on Campgrounds
     - Flash messages were displayed
     - Sessions and cookies were used
     - Every Campground has it's location displayed seperately
## Built with
   - ### Front End
     - HTML, CSS, Bootsrap v5.0
     - EJS, EJS Mate
  - ### Back End
     - NodeJS
     - ExpressJS
     - MongoDB
     - cloudinary
     - MapBox
     - passport(local-strategy)
     - JOI
     - connect-flash
     - async
     - sessions
     - helmet
     - mongoSanitize
     - morgan
     - connect-mongo
### Deployed using Heroku, database on MongoDB Atlas
    
