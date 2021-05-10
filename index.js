// require your server and launch it here
require('dotenv').config()
const server = require('./api/server')
const port = process.env.PORT || 5001

server.get('/', (req, res) => {
    res.status(200).send(`Welcome to the API Server`)
})

server.listen(port, () => {
    console.log(`\n --- API Server is listening on port ${port} --- \n`)
})
