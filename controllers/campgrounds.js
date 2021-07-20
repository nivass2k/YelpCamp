const campground = require("../models/campground");
const {cloudinary}=require("../cloudinary")
const geoCoding=require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geoCoder=geoCoding({accessToken:mapBoxToken});

module.exports.index = async (req, res) => {
  var campgrounds = await campground.find({});
  campgrounds=campgrounds.reverse()
  res.render("campgrounds/index", { campgrounds});
};

module.exports.create = (req, res) => {
  res.render("campgrounds/addnew");
};

module.exports.created = async (req, res) => {

  const Campground = new campground(req.body.Campground);
  Campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  Campground.author = req.user._id;
  const geoData=await geoCoder.forwardGeocode({
    query:req.body.Campground.location,
    limit:1
  }).send()
  // res.send(geoData.body.features[0].geometry.coordinates);
  Campground.geometry=geoData.body.features[0].geometry;
  console.log(Campground);
  await Campground.save();
  req.flash("success", "Successfully made a new Campground!");
  res.redirect(`/campgrounds/${Campground._id}`);
};

module.exports.showCamp = async (req, res) => {
  const details = await campground
    .findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!details) {
    req.flash("error", "Sorry, Cannot find the campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/details", { details });
};

module.exports.editCamp = async (req, res) => {
  // const Campground = await campground.findById(req.params.id);
  const { id } = req.params;
  const Campground = await campground.findById(id);
  if (!Campground) {
    req.flash("error", "Sorry, Cannot find the campground to edit!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { Campground });
};

module.exports.deleteCamp = async (req, res, next) => {
  const Campground = await campground.findById(req.params.id);
  Campground.images.forEach((item)=>{
    cloudinary.uploader.destroy(item.filename)
  })
  await Campground.remove();
  if (!Campground) {
    req.flash("error", "Sorry, Cannot find the campground to delete!");
    return res.redirect("/campgrounds");
  }
  req.flash("success", "Successfully deleted the Campground!");
  res.redirect("/campgrounds");
};

module.exports.updateCamp = async (req, res) => {
  const { id } = req.params;
  // const CampgroundId = await campground.findById(id);
  const Campground = await campground.findByIdAndUpdate(id, {...req.body.Campground});
  console.log(Campground.location,req.body.Campground.location)
  if(Campground.location!=req.body.Campground.location){
    console.log("here")
    const geoData=await geoCoder.forwardGeocode({
      query:req.body.Campground.location,
      limit:1
    }).send();
    Campground.geometry=geoData.body.features[0].geometry;
  }
  if (!Campground) {
    req.flash("error", "Sorry, Cannot find the campground to edit!");
    return res.redirect("/campgrounds");
  }
  const img=req.files.map((f) => ({url: f.path, filename: f.filename,}));
  Campground.images.push(...img);
  await Campground.save();
  if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename);
    }
    await Campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
  }
  req.flash("success", "Successfully updated the Campground!");
  res.redirect(`/campgrounds/${id}`);
};
