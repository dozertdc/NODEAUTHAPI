const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()

app.get('/api', (req, res) => {
    res.json({
        message: "welcome to the api"
    })
})

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'thisisasecret', (err, authData) => {
        if(err){
            res.sendStatus(403)
        }else{
            res.json({
                message: 'post created',
                authData: authData
            })
        }
    })
})

app.post('/api/login', (req, res) => {
    //mock user
    const user = {
        id: 1,
        username: 'travis',
        email: 'travis@gmail.com'
    }
    jwt.sign({user: user}, 'thisisasecret', (err, token) => {
        res.json({
            token: token
        })
    })
})

function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization']
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        // Split at the space
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        req.token = bearerToken
        next()
    }else{
        // Forbidden
        res.sendStatus(403)
    }
}

app.listen(5000, () => {
    console.log('server started on 5000')
})