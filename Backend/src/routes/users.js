const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const isAuthorized = require("../middleware/authorized");

router.get("/checkin", isAuthorized, (req, res, next) => {
    res.status(200).json({
        message: "Checkin Complete",
    });
});

router.get("/checkout", (req, res, next) => {
    res.status(200).json({
        message: "Checkout Complete",
    });
});

router.get("/", async (req, res, next) => {
    const allUsers = await User.find();
    if (!allUsers) {
        res.status(500).json({
            error: "Not Found",
        });
    } else if (allUsers.length < 1) {
        res.status(500).json({
            error: "Empty",
        });
    } else {
        res.status(200).json({
            data: allUsers,
        });
    }
});

// send data in JSON for signup
// needs username, password, phNumber, password
router.post("/signup", async (req, res, next) => {
    try {
        const passwordHash = await bcrypt.hash("testpassword", 10);
        console.log(passwordHash);
        const user = new User({
            _id: mongoose.Types.ObjectId(),
            name: "Admin",
            username: "test",
            phNumber: 3243241,
            password: passwordHash,
            isAdmin: false,
        });
        console.log(user);
        const result = await user.save();
        if (!result) {
            throw new Error("Save Failed");
        } else {
            res.status(201).json({
                message: "User Created",
            });
        }
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const result = await User.find({ username: req.body.username });
        if (!result) {
            res.status(403).json({
                error: "Username doesnt exist",
            });
        } else {
            const outcome = bcrypt.compare(req.password, result.password);
            if (!outcome) {
                res.status(403).json({
                    message: "Invalid Password",
                });
            } else {
                const token = jwt.sign(
                    { username: result.username },
                    process.env.JWT_SECRET_KEY,
                    {}
                );
                res.status(200).json({
                    message: "Logged In",
                    token: token,
                });
            }
        }
    } catch (err) {
        res.status(500).json({
            message: "Auth failed at the bottom",
            error: err,
        });
    }
});
module.exports = router;
