const express = require("express");
const router = express.Router();

router.get("/:userId", (req, res, next) => {
    res.status(200).json({
        message: "Retrieved History based on User",
    });
});

router.get("/:locationId", (req, res, next) => {
    res.status(200).json({
        message: "Retrieved History based on Location",
    });
});

module.exports = router;
