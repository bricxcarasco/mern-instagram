const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');

const Post = mongoose.model('Post');

router.get('/allpost', requireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name")
        .then(posts => {
            res.json({
                posts
            });
        })
        .catch(error => {
            console.log(error);
        });
});

router.get('/mypost', requireLogin, (req, res) => {
    Post.find({
        postedBy: req.user.id
    })
    .populate("postedBy", "_id name")
    .then(myposts => {
        res.json({
            myposts
        });
    })
    .catch(error => {
        console.log(error);
    });
});

router.post('/createpost', requireLogin, (req, res) => {
    const { title, body, photo } = req.body;
    if (!title || !body || !photo) {
        return res.status(422).json({
            error: "Please input the fields"
        });
    }
    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        photo,
        postedBy: req.user
    });
    post.save()
        .then(post => {
            res.json({
                post
            });
        })
        .catch(error => {
            console.log(error);
        });
});

module.exports = router;