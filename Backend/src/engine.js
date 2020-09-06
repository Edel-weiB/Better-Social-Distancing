//_______________________________________________________________________
//
//                          initialise
//_______________________________________________________________________
// Import npm packages
const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config({
    path: __dirname + "/db.env",
});
// Create Express app
const app = express();

// Load Credentials
// const credentials = JSON.parse(
//     fs.readFileSync("./ATLAS_credendials.json", "utf8")
// );

//_______________________________________________________________________
//
//                          Hello World
//_______________________________________________________________________
// To test the server, go to your localhost:3000
// you should see Hello World!
// app.get("/", (req, res) => res.send("Hello World!"));

//_______________________________________________________________________
//
//                          Functions
//_______________________________________________________________________
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

//-------------- Map -------------------
// Add new map points
app.get("/map/add", (req, res) => {
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
        await res.send("done");
    })();
});

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

const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

//_______________________________________________________________________
//
//                          Server
//_______________________________________________________________________

// Start the Express server
app.listen(3000, () => console.log("Server running on port 3000!"));
