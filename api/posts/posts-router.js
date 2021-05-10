// implement your posts router here
const express = require('express')
const Posts = require('./posts-model')
const router = express.Router()

router.get('/', (req, res) => {
    Posts.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            res.status(500).json({message: "The posts information could not be retrieved"})
        })
})

router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            if (!post){
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else res.status(200).json(post)
        })
        .catch(err => {
            res.status(500).json({ message: "The post information could not be retrieved" })
        })
})

router.post('/', (req, res) => {
    if(!req.body.title || !req.body.contents){
        res.status(400).json({ message: "Please provide title and contents for the post" })
    } else Posts.insert(req.body)
        .then(resp => {
            res.status(201).json({ id: resp.id, title: req.body.title, contents: req.body.contents})
        })
        .catch(err => {
            res.status(500).json({message: "Please provide title and contents for the post" })
        })
})

router.put('/:id', (req, res) => {
    if (!req.body.title || !req.body.contents){
        res.status(400).json({message: "Please provide title and contents for the post"})
    } else Posts.findById(req.params.id)
        .then(origPost => {
            if (!origPost){
                res.status(404).json({message: "The post with the specified ID does not exist"})
            } else Posts.update(req.params.id, req.body)
                .then(resp => {
                    if (resp !== 1){
                        res.status(500).json({message: "The post information could not be modified"})
                    } else Posts.findById(req.params.id)
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

router.delete('/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(oldPost => {
            if (!oldPost){
                res.status(404).json({message: "The post with the specified ID does not exist"})
            } else Posts.remove(req.params.id)
                .then(resp => {
                    res.status(200).json(oldPost)
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

router.get('/:id/comments', (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            if (!post){
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else Posts.findPostComments(req.params.id)
            .then(comments => {
                res.status(200).json(comments)
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