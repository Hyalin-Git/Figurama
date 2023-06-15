const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
	cloud_name: `${process.env.CLOUDNAME}`,
	api_key: `${process.env.APIKEY}`,
	api_secret: `${process.env.APISECRETKEY}`,
});

module.exports = cloudinary;
