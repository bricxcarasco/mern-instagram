const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');

const User = mongoose.model("User");
const Post = mongoose.model("Post");

router.get('/user/:id', requireLogin, (req, res) => {
    User.findOne({
        _id: req.params.id
    })
    .select("-password")
    .then(user => {
        Post.find({
            postedBy: req.params.id
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

router.put('/follow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.id, {
        $push: {
            followers: req.user._id
        }
    }, {
        new: true
    }, (error, result) => {
        if (error) {
            console.log(error);
            res.status(422).json(error);
        }

        User.findByIdAndUpdate(req.user._id, {
            $push: {
                following: req.body.id
            }
        }, {
            new: true
        })
        .select("-password")
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            console.log(error);
            return res.status(422).json(error);
        });
    });
});

router.put('/unfollow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.id, {
        $pull: {
            followers: req.user._id
        }
    }, {
        new: true
    }, )
    .exec((error, result) => {
        if (error) {
            console.log(error);
            res.status(422).json(error);
        }
        
        User.findByIdAndUpdate(req.user._id, {
            $pull: {
                following: req.body.id
            }
        }, {
            new: true
        })
        .select("-password")
        .exec((error, result) => {
            if (error) {
                console.log(error);
                res.status(422).json(error);
            }
            res.json(result);
        });
    });
});

module.exports = router;