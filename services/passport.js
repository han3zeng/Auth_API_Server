const passport = require('passport')
const User = require('../models/user')
const config = require('../config')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')

// create local strategy
// change default from username to email
// localStrategy will find username and password automatically
const localOptions = { usernameField: 'email' }
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // verify this usernmae and password, call done with the user
  // if it is the correct username and password
  // otherwise, call done with false
  console.log(email,password)
  User.findOne({ email: email}, function(err, user) {
    if(err) {
      return done(err)
    }
    if(!user) {
      return done(null, false)
    }
    // compare passwords: if password is equal to user.password
    // password is plain, user.password is salted hashed pw
    // so, salt + hashed plain password then compare two
    user.comparePassword(password, function(err, isMatch) {
      if(err) { return done(err) }
      if(!isMatch) { return done(null, false) }
      return done(null, user)
    })
  })
})


// config JwtStrategy
// jwtFromRequest: inform JwtStrategy that in each request
// it should look at authorization part of header to find JWT
// declare the secretKey so jwtStrategy know how to decrypt the token
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
}


// create JWT Strategy

// whenevre user want to login with jwt (request), the call back funciton will be invoked
// payload: is decrypted JSON Web Token
// in authentication.js { sub: user.id, iat: timestamp } which is payload
// so payload will have usb and iat properties
// sub: user.id === object_id which is created by mongodb
// done is a callback function
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // see if user ID in the payload exists in our database
  // if it does, call done with that user
  // otherwise, call donw without a user object
  User.findById(payload.sub, function(err, user) {
    if(err) {
      return done(err, false)
    }
    if(user) {
      done(null, user)
    } else {
      done(null, false)
    }
  })
})

// Tell passport to use strategies
passport.use(jwtLogin)
passport.use(localLogin)
