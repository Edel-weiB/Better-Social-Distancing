const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");

// MongoDB client kept connection status for timebeing until migration into Mongoose

exports.connect_2_db = (credentials) => {
    const ATLAS_connection_string =
        "mongodb+srv://" +
        credentials.username +
        ":" +
        credentials.password +
        credentials.hostName +
        "/" +
        credentials.cluster +
        "?retryWrites=true&w=majority";
    const uri =
        ATLAS_connection_string +
        "&useNewUrlParser=true&useUnifiedTopology=true";
    console.log(uri);
    const client = new MongoClient(uri);

    return client;
};
exports.sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

exports.mongooseconnect = () => {
    mongoose.connection.on("open", (ref) => {
        console.log("Connection to MongoDB Atlas Established");
    });

    mongoose.connection.on("error", (error) => {
        console.log("Connection Failed Below is the Error Message");
    });

    const URL =
        `mongodb+srv://` +
        process.env.DATABASE1_USERNAME +
        ":" +
        process.env.DATABASE1_PASSWORD +
        "@" +
        process.env.DATABASE1_HOST +
        "/" +
        process.env.DATABASE1_COLLECTION +
        "?retryWrites=true&w=majority";

    const client = mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    return client;
};
