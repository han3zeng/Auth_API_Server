// User class which represent whole Users collection inside database
const User = require('../models/user')
// tool require for creating JWT
const jwt = require('jwt-simple')
const config = require('../config')

function tokenForUser(user) {
  // first arg: information that we want to encode
  // sec arg: secret string
  // sub is a standard convention  => subject
  // iat = issue at time
  const timestamp = new Date().getTime()
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}


module.exports.signin = (req, res, next) => {
  // user has already had their email and password authed
  // we just need to give them a token
  // we need to get current user model
  // in localLogin strategy, there is a done call back which supplied by passportJS
  // : done(null, user)
  // the user model is signed to req.user
  res.send( { token: tokenForUser(req.user) })
}


module.exports.signup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  // user need to input both email and password
  if (!email || !password) {
    return res.status(422).send({ error: 'you must provide both email and password' })
  }

  // If a user with the given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    // existingUser: if user existed, pass the user object
    // no, null
    if(err) {
      return next(err)
    }
    //  If a user with email does exist, return an error
    if(existingUser) {
      // res.status == http status code
      return res.status(422).send({ error: 'Email is in use' })
    }

    //  If a user with email does NOT exist, create and save user record
    const user = new User({
      email: email,
      password: password
    })

    user.save(function(err) {
      if(err) {
        return next(err)
      }
      // Respond to request indicating the user was created
      // actually send an authenticated token
      // stringify object, array to json string
      res.json({ token: tokenForUser(user) })
    })
  })
}


// module.exports.signup === exports.signup
