const fs = require("fs");
const express = require("express");
const router = express.Router();
const connectMongo = require("../helpers/connectdb");
const rng = require("../helpers/rng");
const mongoose = require("mongoose");

// Load Credentials
const credentials = JSON.parse(
    // Added __dirname for relative directory search
    fs.readFileSync(__dirname + "/../helpers/ATLAS_credendials.json", "utf8")
);

router.post("/add/:location", (req, res) => {
    const { location } = req.params;

    // Main Run
    (async () => {
        // Connect and insert data
        const client = connectMongo.connect_2_db(credentials);
        await client.connect();
        const db = client.db("map");
        const collection = db.collection("location");
        await collection.insertOne({
            location: location,
        });
        client.close();
        // send done signal
        req.body = { Ok: true };
        await res.json(req.body);
    })();
});

router.get("/", (req, res) => {
    // Main Run
    (async () => {
        // Connect and insert data
        const client = connectMongo.connect_2_db(credentials);
        await client.connect();
        const db = client.db("map");
        const collection = db.collection("location");
        let cursor = await collection.find({});
        let cursor_array = await cursor.toArray();
        //console.log(cursor_array)
        await client.close();
        // send done signal
        req.body = {
            items: cursor_array,
        };
        await res.json(req.body);
    })();
});

module.exports = router;
