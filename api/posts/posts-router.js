// implement your posts router here
const express = require('express')
const Posts = require('./posts-model')
const router = express.Router()

router.get('/', async (req, res) => {
    await Posts.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            res.status(500).json({message: "The posts information could not be retrieved"})
        })
})

router.get('/:id', async (req, res) => {
    await Posts.findById(req.params.id)
        .then(post => {
            if (!post){
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else res.status(200).json(post)
        })
        .catch(err => {
            res.status(500).json({ message: "The post information could not be retrieved" })
        })
})

router.post('/', async (req, res) => {
    if(!req.body.title || !req.body.contents){
        res.status(400).json({ message: "Please provide title and contents for the post" })
    } else await Posts.insert(req.body)
        .then(resp => {
            res.status(201).json({ id: resp.id, title: req.body.title, contents: req.body.contents})
        })
        .catch(err => {
            res.status(500).json({message: "Please provide title and contents for the post" })
        })
})

router.put('/:id', async (req, res) => {
    if (!req.body.title || !req.body.contents){
        res.status(400).json({message: "Please provide title and contents for the post"})
    } else await Posts.findById(req.params.id)
        .then(async origPost => {
            if (!origPost){
                res.status(404).json({message: "The post with the specified ID does not exist"})
            } else await Posts.update(req.params.id, req.body)
                .then(async resp => {
                    if (resp !== 1){
                        res.status(500).json({message: "The post information could not be modified"})
                    } else await Posts.findById(req.params.id)
                        .then(newPost => {
                            res.status(200).json(newPost)
                        })
                        .catch(err => {
                            console.log(`error fetching new post: `, err)
                            res.status(500).json({message: "The post information could not be modified" })
                        })
                })
                .catch(err => {
                    console.log(`error posting new post: `, err)
                    res.status(500).json({message: "The post information could not be modified"})
                })
        })
        .catch(err => {
            console.log(`error fetching old post: `, err)
        })
})

router.delete('/:id', async (req, res) => {
    await Posts.findById(req.params.id)
        .then(async oldPost => {
            if (!oldPost){
                res.status(404).json({message: "The post with the specified ID does not exist"})
            } else await Posts.remove(req.params.id)
                .then(resp => {
                    res.status(200).json({message: `${resp} post(s) removed`, post: oldPost})
                })
                .catch(err => {
                    console.log(`error removing post: `, err)
                    res.status(500).json({ message: "The post could not be removed" })
                })
        })
        .catch(err => {
            console.log(`error fetching old post: `, err)
            res.status(500).json({ message: "The post could not be removed" })
        })
})

router.get('/:id/comments', async (req, res) => {
    await Posts.findById(req.params.id)
        .then(async post => {
            if (!post){
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else await Posts.findPostComments(req.params.id)
                .then(comments => {
                    res.status(200).json({post, comments})
                })
                .catch(err => {
                    console.log(`error fetching comments: `, err)
                    res.status(500).json({ message: "The comments information could not be retrieved" })
                })
        })
        .catch(err => {
            console.log(`error fetching post: `, err)
            res.status(500).json({ message: "The comments information could not be retrieved" })
        })
    
})

module.exports = router