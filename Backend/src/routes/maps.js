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
    // Add Status 200 and sending JSON
    res.status(200).send(JSON.stringify([x, y]));
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

module.exports = router;
