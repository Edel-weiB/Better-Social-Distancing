const mongoose = require("mongoose");

const heatmapSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    lat: {
        type: Number,
        required: true,
    },
    long: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("Heatmap", heatmapSchema, "heatmap");
