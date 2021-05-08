// implement your server here
const express = require('express')
const server = express()
// require your posts router and connect it here
const router = require('./posts/posts-router')

server.use(express.json())
server.use('/api/posts', router)

module.exports = server
