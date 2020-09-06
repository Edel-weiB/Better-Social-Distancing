//_______________________________________________________________________
//
//                          initialise
//_______________________________________________________________________
// Import npm packages
const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;

// Load Credentials
const credentials = JSON.parse(
    // Added __dirname for relative directory search
    fs.readFileSync(__dirname + "/ATLAS_credendials.json", "utf8")
);

require("dotenv").config({
    path: __dirname + "/db.env",
});
// Create Express app
const app = express();

//_______________________________________________________________________
//
//                          RNJesus
//_______________________________________________________________________
// Box Mullet Transform RNG
// https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
// ---
// for singapore
// minx = 1.239808
// miny = 103.670679
// maxx = 1.462897
// maxy = 103.972252
// centre_x = 1.289832
// centre_y = 103.845270
random = (n, min_x, min_y, max_x, max_y, centre_x, centre_y) => {
    const sigma = 1;
    const mean = 1;

    const transformConst = 4;
    const transformX = (max_x - min_x) / transformConst;
    const offsetX = (max_x + min_x) / 2;
    const transformY = (max_y - min_y) / transformConst;
    const offsetY = (max_y + min_y) / 2;

    let x = new Array(n);
    let y = new Array(n);

    for (i = 0; i < n; i++) {
        u1 = Math.random();
        u2 = Math.random();

        R = Math.sqrt(-2 * Math.log(u1));
        theta = 2 * Math.PI * u2;

        z1 = R * Math.cos(theta);
        z2 = R * Math.sin(theta);

        x[i] = (z1 * sigma + mean) * transformX + offsetX;
        y[i] = (z2 * sigma + mean) * transformY + offsetY;
    }
    return [x, y];
};

//_______________________________________________________________________
//
//                          Functions
//_______________________________________________________________________

// MongoDB client kept connection status for timebeing until migration into Mongoose

connect_2_db = (credentials) => {
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
sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

// Mongoose Connection to MongoDB Atlas

mongoose.connection.on("open", (ref) => {
    console.log("Connection to MongoDB Atlas Established");
});

mongoose.connection.on("error", (error) => {
    console.log("Connection Failed Below is the Error Message");
});

const URL =
    `mongodb+srv://` +
    process.env.DATABASE_USERNAME +
    ":" +
    process.env.DATABASE_PASSWORD +
    "@" +
    process.env.DATABASE_HOST +
    "/" +
    process.env.DATABASE_COLLECTION +
    "?retryWrites=true&w=majority";

console.log(URL);

// const URL = mongodb+srv://"node-rest-test:helloworld@node-restapi-test.q1k57.mongodb.net/test?retryWrites=true&w=majority
const client = mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//_______________________________________________________________________
//
//                          Routings
//_______________________________________________________________________

//Ensure to prevent CORS Error
app.use((req, res, next) => {
    // allows access from anywhere
    res.header("Access-Control-Allow-Origin", "*");
    // You can also restrict access from only this website can access the api
    // though it is not recommended. But it doesnt protect/restrict access from testing tools like Postman
    // res.header('Access-Control-Allow-Origin', 'http"//my-cool-page.com')

    // Specifies which headers can we can accept
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With , Content-Type, Accept, Authorization"
    );

    if (req.method === "OPTIONS") {
        // Set Requested methods youd wish to support.
        res.header(
            "Access-Control-Allow-Methods",
            "PUT, POST, PATCH, DELETE, GET"
        );
        return res.status(200).json({});
    }
    // THE AUTHOR HERE IS AN ABSOLUTE DUMBASS FORGOT TO PUT THE LINE BELOW
    // ALlow other routes to take over as well
    next();
});

//-------------- Map -------------------
// Add new map points
app.post("/map/add", (req, res) => {
    const x = req.query.pointx;
    const y = req.query.pointy;

    // Main Run
    (async () => {
        // Connect and insert data
        const client = connect_2_db(credentials);
        await client.connect();
        const db = client.db("map");
        const collection = db.collection("heatmap");
        await collection.insertOne({
            x: x,
            y: y,
        });
        client.close();
        // send done signal
        await res.status(201).json({
            message: "Done",
        });
    })();
});

//-------------- RNG -------------------
app.get("/rng", (req, res) => {
    const n = 10;

    let numbers = random(
        n,
        1.239808,
        103.670679,
        1.462897,
        103.972252,
        1.289832,
        103.84527
    );
    let x = numbers[0];
    let y = numbers[1];

    res.send(JSON.stringify([x, y]));
});

// User Routes
const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

//_______________________________________________________________________
//
//                          Server
//_______________________________________________________________________

// Start the Express server
app.listen(3000, () => console.log("Server running on port 3000!"));
