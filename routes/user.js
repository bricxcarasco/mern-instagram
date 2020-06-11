const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');

const User = mongoose.model("User");
const Post = mongoose.model("Post");

router.get('/user/:id', (req, res) => {
    User.findOne({
        _id: req.params._id
    })
    .select("-password")
    .then(user => {
        Post.find({
            postedBy: req.params._id
        })
        .populate("postedBy", "_id name")
        .exec((error, posts) => {
            if (error) {
                console.log(error);
                return res.status(422).json({error});
            }
            res.json({
                user,
                posts
            })
        });
    })
    .catch(error => {
        console.log(error);
        return res.status(404).json({
            error: "User not found"
        })
    })
});

module.exports = router;