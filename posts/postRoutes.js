const express = require ('express');
const router = express.Router();
const Posts = require('../data/db');
const Comments = require ("../data/db");




//GETS
router.get ('/', (req, res) =>{
    res.status(200).send('Hello Server test')
});
router.get ('/posts', (req, res) =>{
    Posts.find().then (posts =>{
            res.status(200).json(posts);
    }).catch(err => {
        console.log(err);
        res.status(500).json({errorMessage: "It's not you, it's me"})
    });

})
router.get('/posts/:id',  (req, res) =>{
    const id = req.params.id;
        Posts.findById(id).then (postsId=>{
                    res.status(200).json(postsId);
            }).catch(err => {
                res.status(500).json({errorMessage: "It's not you, it's me"})
            });
        })
router.get('/posts/:id/comments', (req, res) =>{
    const id = req.params.id;
    Comments.findPostComments(id).then (comments =>{
                res.status(200).json(comments);
        }).catch(err => {
            console.log(err);
            res.status(500).json({errorMessage: "It's not you, it's me"})
        });
    })


//POSTS
router.post('/posts', (req, res) =>{
    const postInfo = req.body;

    if (!postInfo.title || !postInfo.contents) {
        res.status(400).json({
            success: false,
            errorMessage: "Please provide title and contents for the post"
        });
    } else {
    Posts
    .insert(postInfo)
    .then (response =>{
        if (response.id) {
        res.status(201).json({ ...postInfo, id: response.id });
} else {
    res.status(500).json({
        success: false,
        errorMessage:
            "There was an error: It's not you, it's me"
    });
}})
.catch(err => {
res.status(500).json({
    success: false,
    error: err,
    errorMessage:
        "There was an error: It's not you, it's me"
});
});
}});

router.post("/posts/:id/comments", (req, res) => {
    const  id  = req.params;
    const comment = { ...req.body, post_id: id };

    if (!comment.text) {
        res.status(400).json({
            success: false,
            errorMessage: "Please provide text for the comment"
        });
    } else {
        posts
            .insertComment(comment)
            .then(response => {
                res.status(201).json({ ...comment, id: response.id });
            })
            .catch(error => {
                res.status(404).json({
                    success: false,
                    errorMessage:
                        "The post with the specified ID does not exist"
                });
            });
    }
});



module.exports = router;