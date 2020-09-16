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
    console.log(process.env.DATABASE1_HOST);
    console.log(process.env.DATABASE1_USERNAME);
    const URL =
        "mongodb+srv://" +
        process.env.MONGODB_USERNAME +
        ":" +
        process.env.MONGODB_PASSWORD +
        "@" +
        process.env.MONGODB_HOST +
        "/" +
        process.env.MONGODB_COLLECTION +
        "?retryWrites=true&w=majority";

    const client = mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    return client;
};
