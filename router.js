// next is usually for error handling, and pass control to next handler
const Authentication = require('./controllers/authentication')
// we import passportservice just want to make sure the passport.js file
// is executed. When user reqeust /login url, runtime will go through requireAuth
// the stragtegy of requireAuth middleware is setted to be jwt. Therefore,
// passport runtime will execute passportService automatically
const passportService = require('./services/passport')
const passport = require('passport')

// in default, passport try to use cookie-based session
// so we set it to false, and declare use JWT
const requireAuth = passport.authenticate('jwt', { session: false })
const requireSignin = passport.authenticate('local', { session: false })


module.exports = (app) => {
  // any request to login url
  // need to pass requireAuth to, if pass go to call back function
  app.get('/protectedSource', requireAuth, function(req, res){
    res.send({ message: 'super secret code is abc123'  })
  })

  app.post('/signin', requireSignin, Authentication.signin)

  app.post('/signup', Authentication.signup)
}
