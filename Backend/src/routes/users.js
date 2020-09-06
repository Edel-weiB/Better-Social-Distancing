const express = require("express");
const router = express.Router();

router.get("/checkin", (req, res, next) => {
    res.status(200).json({
        message: "Checkin Complete",
    });
});

router.get("/checkout", (req, res, next) => {
    res.status(200).json({
        message: "Checkout Complete",
    });
});

module.exports = router;
