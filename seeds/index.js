const mongoose = require("mongoose");
const cities = require("./ph");
const { places, descriptors } = require("./seedsHelpers");
const Datingplace = require("../models/datingplace");

mongoose.connect("mongodb://127.0.0.1:27017/date-mee");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Datingplace.deleteMany({});
  for (let i = 0; i < 400; i++) {
    const random51 = Math.floor(Math.random() * 51) + 1;
    const price = Math.floor(Math.random() * 1000) + 500;
    const place = new Datingplace({
      author: "64f98c312542c9f4e8172f8f",
      location: `${cities[random51].city}, ${cities[random51].admin_name}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem quo, optio officia est asperiores qui dolor temporibus aspernatur distinctio ut commodi exercitationem culpa. Molestias saepe voluptate explicabo perspiciatis eveniet quaerat.",
      price,
      geometry: {
        type: "Point",
        coordinates: [cities[random51].lng, cities[random51].lat],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dirp81rhi/image/upload/v1694682031/DatingMee/dnqjvm3ktjdndcxdcjnt.webp",
          filename: "DatingMee/dnqjvm3ktjdndcxdcjnt",
        },
        {
          url: "https://res.cloudinary.com/dirp81rhi/image/upload/v1694682033/DatingMee/rwsegafywds0hs3uymc5.webp",
          filename: "DatingMee/rwsegafywds0hs3uymc5",
        },
      ],
    });
    await place.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
