const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../keys');

const requireLogin = require('../middleware/requireLogin');

const User = mongoose.model('User');

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(422).json({
            error: "Please add required fields"
        });
    }

    User.findOne({ email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({
                    error: "User already existed with that email!"
                });
            }

            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email,
                        password:hashedPassword,
                        name
                    });
        
                    user.save()
                        .then(user => {
                            res.json({
                                message: "Save successfully!"
                            });
                        })
                        .catch(error => {
                            console.log(error);
                        });
                });            
        })
        .catch(error => {
            console.log(error);
        });
});

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({
            error: "Please input email or password!"
        });
    }
    User.findOne({ email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({
                    error: "Invalid email address or password"
                });
            }
            bcrypt.compare(password, savedUser.password)
                .then(doPasswordMatched => {
                    if (doPasswordMatched) {
                        // res.json({
                        //     message: "Successfully signed in"
                        // });
                        const token = jwt.sign({
                            _id: savedUser._id
                        }, JWT_SECRET);

                        res.json({
                            token
                        });
                    } else {
                        return res.status(422).json({
                            error: "Invalid email address or password"
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        })
});

module.exports = router;