const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const isAuthorized = require("../middleware/authorized");

router.get("/checkin", isAuthorized, async (req, res, next) => {
    // const user = await User.findById(req.body.
    res.status(200).json({
        message: "Checkin Complete",
    });
});

router.get("/checkout", isAuthorized, (req, res, next) => {
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
// needs username, password, phNumber, name
router.post("/signup", async (req, res, next) => {
    try {
        const passwordHash = await bcrypt.hash(req.body.password, 10);
        console.log(passwordHash);
        const user = new User({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            username: req.body.username,
            phNumber: req.body.phNumber,
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
        const user = await User.find({ username: req.body.username });
        if (!user) {
            res.status(500).json({
                error: "Username doesnt exist",
            });
        } else {
            console.log(user[0].password);
            const outcome = await bcrypt.compare(
                req.body.password,
                user[0].password
            );
            if (!outcome) {
                res.status(401).json({
                    message: "Invalid Password",
                });
            } else {
                const token = jwt.sign(
                    { username: user.username },
                    process.env.JWT_SECRET_KEY
                );
                console.log(token);
                res.status(200).json({
                    message: "Logged In",
                    username: user.username,
                    _id: user._id,
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
