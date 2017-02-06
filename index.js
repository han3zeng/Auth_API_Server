// main starting point of the application
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const router = require('./router')
const mongoose = require('mongoose')
const UserClass = require('./models/user')

// cors error
const cors = require('cors')

//DB Setup
mongoose.connect('mongodb://localhost/auth')


// App Setup
// internal work
// app.use(middleware)
// any incoming request will go through app.use

// morgan is logging framework which can log all http request
// main goal of this middleware is for debugging
// combined is just a outpug format of log

// bodyParser: parse incoming request from json to javascritp object
// '*/*' no matter what request type is

app.use(morgan('combined'));
// you can specify let in request from some specific domains 
app.use(cors())
app.use(bodyParser.json({type : '*/*'}))
router(app)

// Server Setup
// interact with outside world

// if you define env port number then use that, otherwise use 3090
const port = process.env.PORT || 3090
// create an http server that knows how to receive http requests
// and forward those requests to 'app' application
const server = http.createServer(app)
server.listen(port,function() {
  console.log('server listening on' + port)
});
