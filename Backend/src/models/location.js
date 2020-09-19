const mongoose = require("mongoose");
const Heatmap = require("./heatmap");

const locationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    locationName: {
        type: String,
        required: true,
    },
    locationPostalCode: {
        type: Number,
        required: true,
    },
    coordinates: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Heatmap",
        required: true,
    },
});

module.exports = mongoose.Model("Location", locationSchema, "locations");
