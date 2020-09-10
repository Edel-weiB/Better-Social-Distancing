const fs = require("fs");
const express = require("express");
const router = express.Router();
const connectMongo = require("../helpers/connectdb");
const rng = require("../helpers/rng");
const mongoose = require("mongoose");
const Heatmap = require("../models/heatmap");

// Load Credentials
const credentials = JSON.parse(
    // Added __dirname for relative directory search
    fs.readFileSync(__dirname + "/../helpers/ATLAS_credendials.json", "utf8")
);

router.get("/", (req, res) => {
    // Main Run
    (async () => {
        // Connect and insert data
        const client = connectMongo.connect_2_db(credentials);
        await client.connect();
        const db = client.db("map");
        const collection = db.collection("heatmap");
        let cursor = await collection.find({});
        let cursor_array = await cursor.toArray();
        //console.log(cursor_array)
        await client.close();
        // send done signal
        req.body = {
            items: cursor_array,
        };
        // Added status code for recieving data
        await res.status(200).json(req.body);
    })();
});

//-------------- Map Routes -------------------
// Add new map points
router.post("/add", (req, res) => {
    const x = req.query.pointx;
    const y = req.query.pointy;

    // Main Run
    (async () => {
        // Connect and insert data
        const client = connectMongo.connect_2_db(credentials);
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
router.get("/rng", (req, res) => {
    const n = 10;

    let numbers = rng.random(
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

    let temp_array = new Array(x.length);
    for (let i = 0; i < x.length; i++) {
        temp_array[i] = {
            lat: x[i],
            long: y[i],
        };
    }

    req.body = temp_array;
    res.json(req.body);
});
// Added the Heatmap data endpoint
// To Query http://localhost:3000/map/heatmap
router.get("/heatmap", async (req, res) => {
    Heatmap.find()
        .exec()
        .then((result) => {
            console.log(result);
            res.status(200).json({
                result: result,
            });
        })
        .catch((err) => {
            res.status(400).json({
                error: err,
            });
        });
});

router.put("/add_many/:n", (req, res) => {
    const { n } = req.params;

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

    let temp_array = new Array(x.length);
    for (let i = 0; i < x.length; i++) {
        temp_array[i] = {
            lat: x[i],
            long: y[i],
        };
    }

    // Main Run
    (async () => {
        // Connect and insert data
        const client = mongoConnect.connect_2_db(credentials);
        await client.connect();
        const db = client.db("map");
        const collection = db.collection("heatmap");
        await collection.insertMany(temp_array, {
            ordered: false,
        });
        client.close();
        // send done signal
        req.body = { Ok: true };
        await res.json(req.body);
    })();
});

module.exports = router;
