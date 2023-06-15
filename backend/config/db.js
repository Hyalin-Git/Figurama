const mongoose = require("mongoose");

// To avoid the warning in the console
mongoose.set("strictQuery", false);

mongoose
	.connect(
		`mongodb+srv://${process.env.DB_USER_PASS}@cluster0.vft3ueu.mongodb.net/?retryWrites=true&w=majority`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.log("Failed to connect to MongoDB", err));
