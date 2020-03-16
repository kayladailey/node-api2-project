const express = require ('express');
const router = express.Router();


//GETS
router.get ('/', (req, res) =>{
    res.status(200).send('Hello Server test')
});

router.get('/posts/:id',  (req, res) =>{
    res.status(200).send(`hello from /GET /posts endpoint`)
});

router.get('/posts/:id/comments', (req, res) =>{
    const id = req.params.id;
    res.status(200).send(`hello from /GET /posts ${id} endpoint`)
});

//POSTS
router.post('/posts', (req, res) =>{
    res.status(200).send(`hello from /POST /posts endpoint`)
});

router.post('/posts/:id/comments', (req, res) =>{
    const id = req.params.id;
    res.status(200).send(`hello from /POST /posts ${id} endpoint`)
});

//DELETE
router.delete('/posts/:id', (req, res) =>{
    const id = req.params.id;
    res.status(200).send(`hello from /DELETE /posts ${id} endpoint`)
});

//PUT
router.put('/posts/:id', (req, res) =>{
    const id = req.params.id;
    res.status(200).send(`hello from /PUT /posts ${id} endpoint`)
});


module.exports = router;