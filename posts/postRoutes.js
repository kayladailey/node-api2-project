const express = require("express");
const posts = require("../data/db.js");
const router = express.Router();

router.get("/", (req, res) => {
    posts
        .find()
        .then(arr => {
            res.status(200).json(arr);
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                errorMessage: "Error retrieving posts"
            });
        });
});

router.get("/:id", (req, res) => {
    const { id } = req.params;

    posts
        .findById(id)
        .then(requestedPost => {
            requestedPost.length === 0
                ? res.status(404).json({
                      success: false,
                      errorMessage: "The requested post was not found"
                  })
                : res.status(200).json(requestedPost);
        })
        .catch(err => {
            res.status(500).json({
                succes: false,
                errorMessage: "Error retrieving post"
            });
        });
});

router.post("/", (req, res) => {
    const post = req.body;

    if (!post.title || !post.contents) {
        res.status(400).json({
            success: false,
            errorMessage: "Please provide title and contents for the post"
        });
    } else {
        posts
            .insert(post)
            .then(response => {
                if (response.id) {
                    res.status(201).json({ ...post, id: response.id });
                } else {
                    res.status(500).json({
                        success: false,
                        errorMessage:
                            "There was an error while saving the post to the database"
                    });
                }
            })
            .catch(err => {
                res.status(500).json({
                    success: false,
                    error: err,
                    errorMessage:
                        "There was an error while saving the post to the database"
                });
            });
    }
});

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const updatedPost = { ...req.body };

    if (!updatedPost.title || !updatedPost.contents) {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post"
        });
    } else {
        posts
            .update(id, updatedPost)
            .then(response => {
                if (response < 1) {
                    res.status(404).json({
                        errorMessage:
                            "The post with the specified ID does not exist"
                    });
                } else {
                    res.status(200).send(updatedPost);
                }
            })
            .catch(error => {
                res.status(500).json({
                    errorMessage: "The post information could not be modified"
                });
            });
    }
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;

    posts
        .remove(id)
        .then(response => {
            if (response < 1) {
                res.status(404).json({
                    errorMessage:
                        "The post with the specified ID does not exist"
                });
            } else {
                res.status(200).send(`Successfully deleted ${response} posts`);
            }
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                errorMessage: "The post could not be removed"
            });
        });
});

// CRUD methods for comments

router.get("/:id/comments", (req, res) => {
    const { id } = req.params;

    posts
        .findById(id)
        .then(resp => {
            if (resp.length === 0) {
                res.status(404).json({
                    success: false,
                    errorMessage: "The post with the specified id was not found"
                });
            } else {
                posts
                    .findPostComments(id)
                    .then(response => {
                        res.status(200).json(response);
                    })
                    .catch(error => {
                        res.status(500).json({
                            success: false,
                            error: error,
                            errorMessage:
                                "The comments information could not be retrieved"
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                errorMessage: "The comments information could not be retrieved"
            });
        });
});

router.post("/:id/comments", (req, res) => {
    const { id } = req.params;
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
            // the readme says this method returns an error if no post with the id exists, so how do we check if there's an error saving to the database?
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