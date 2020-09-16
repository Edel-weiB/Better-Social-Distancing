const mongoose = require("mongoose");
const heatmap = require("./heatmap");

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
    },
    // username is our primary key
    username: {
        type: String,
        required: true,
        unique: true,
    },
    phNumber: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
});

module.exports = mongoose.model("User", userSchema, "users");
