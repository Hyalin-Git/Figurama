const multer = require("multer");

const storage = multer.diskStorage({
	filename: (req, file, cb) => {
		cb(null, file.fieldname + "-" + Date.now());
	},
});

module.exports = multer({ storage });
