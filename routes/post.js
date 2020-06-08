const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');

const Post = mongoose.model('Post');

router.get('/posts', requireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .then(posts => {
            res.json({
                posts
            });
        })
        .catch(error => {
            console.log(error);
        });
});

router.get('/my-post', requireLogin, (req, res) => {
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

router.post('/create-post', requireLogin, (req, res) => {
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

router.delete('/delete-post/:postId', requireLogin, (req, res) => {
    Post.findOne({
        _id: req.params.postId
    })
    .populate("postedBy", "_id")
    .exec((error, post) => {
        if (error || !post) {
            return res.status(422).json(error);
        }

        if (post.postedBy._id.toString() === req.user._id.toString()) {
            post.remove()
            .then(result => {
                res.json(result);
            })
            .catch(error => {
                console.log(error);
            })
        }
    })
});

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {
            likes: req.user._id
        }
    }, {
        new: true
    })
    .exec((error, result) => {
        if (error) {
            return res.status(422).json(error);
        } else {
            res.json(result);
        }
    });
});

router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: {
            likes: req.user._id
        }
    }, {
        new: true
    })
    .exec((error, result) => {
        if (error) {
            return res.status(422).json(error);
        } else {
            res.json(result);
        }
    });
});

router.put('/comment', requireLogin, (req, res) => {
    const { comment, postId } = req.body;
    const comments = {
        text: comment,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(postId, {
        $push: {
            comments
        }
    }, {
        new: true
    })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((error, result) => {
        if (error) {
            res.status(422).json(error);
        } else {
            res.json(result);
        }
    });
});

module.exports = router;