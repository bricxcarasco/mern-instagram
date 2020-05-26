const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hello");
});

router.post('/signup', (req, res) => {
    const {
        name,
        email,
        password
    } = req.body;

    if (!name || !email || !password) {
        return res.status(422).json({
            error: "Please add required fields"
        });
    }

    res.status(200).json({
        message: "Sucessfuly posted!"
    });
});

module.exports = router;