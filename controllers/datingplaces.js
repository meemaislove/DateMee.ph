const Datingplace = require("../models/datingplace");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const datingplaces = await Datingplace.find({});
  res.render("datingplaces/index", { datingplaces });
};

module.exports.renderNewForm = (req, res) => {
  res.render("datingplaces/new");
};

module.exports.createDatingplace = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.datingplace.location,
      limit: 1,
    })
    .send();
  const datingplace = new Datingplace(req.body.datingplace);
  datingplace.geometry = geoData.body.features[0].geometry;
  datingplace.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  datingplace.author = req.user.id;
  await datingplace.save();
  console.log(datingplace);
  req.flash("success", "Succesfully made a new datingplace!");
  res.redirect(`/datingplaces/${datingplace.id}`);
};

module.exports.showDatingplace = async (req, res) => {
  const datingplace = await Datingplace.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!datingplace) {
    req.flash("error", "Cannot find that datingplace!");
    return res.redirect("/datingplaces");
  }
  res.render("datingplaces/show", { datingplace });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const datingplace = await Datingplace.findById(id);
  if (!datingplace) {
    req.flash("error", "Cannot find that datingplace");
    res.redirect("/datingplaces");
  }
  res.render("datingplaces/edit", { datingplace });
};

module.exports.updateDatingplace = async (req, res) => {
  const { id } = req.params;
  const datingplace = await Datingplace.findByIdAndUpdate(id, {
    ...req.body.datingplace,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  datingplace.images.push(...imgs);
  await datingplace.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await datingplace.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(datingplace);
  }
  req.flash("success", "Succesfully updated datingplace!");
  res.redirect(`/datingplaces/${datingplace.id}`);
};

module.exports.deleteDatingplace = async (req, res) => {
  const { id } = req.params;
  await Datingplace.findByIdAndDelete(id);
  req.flash("success", "Successfully delete datingplace!");
  res.redirect("/datingplaces");
};
