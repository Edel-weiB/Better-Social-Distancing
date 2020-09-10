//_______________________________________________________________________
//
//                          Initialise
//_______________________________________________________________________
// Import npm packages
const fs = require("fs");
const express = require("express");
const connectdb = require("./helpers/connectdb");
const morgan = require("morgan");

const bodyParser = require("body-parser");
// Loading dotenv
require("dotenv").config({
    path: __dirname + "/db.env",
});
// Create Express app
const app = express();

//_______________________________________________________________________
//
//                          Functions
//_______________________________________________________________________

// Mongoose Connection to MongoDB Atlas
connectdb.mongooseconnect();

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
    // Makes this function pass on the next route so this acts like a passthrough
    next();
});

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Map Routes (RNG and add)
const mapRoutes = require("./routes/maps");
app.use("/map", mapRoutes);

// User Routes (Checkin and Checkout)
const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

const locationRoutes = require("./routes/locations");
app.use("/location", locationRoutes);

//_______________________________________________________________________
//
//                          Server
//_______________________________________________________________________

// Start the Express server
app.listen(3000, () => console.log("Server running on port 3000!"));

module.exports = app; // for testing
