const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

// Define model
// email.unique make sure before mongoDB save the model which probided by user is unique
// mongodb can't tell the differencebetween lowercase and uppercase, so we add lowercase true
// type, unique, lowercase are predefined key
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
})

// On Save Hook, encrypt password
// pre 'save' => before the user model is saved, run the following function
userSchema.pre('save', function(next) {
  // get access to the user model
  const user = this;

  // generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt){
    if(err) {
      return next(err)
    }

    // hadh (encrypt) our password using the salt, then run callback
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if(err) {
        return next(err)
      }

      // overwrite palin text password with encrypted password
      user.password = hash
      // go ahead and save the model
      next()
    })
  })
})


userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) {
      return callback(err)
    }
    callback(null, isMatch)
  })
}


// Create the model class
const UserClass = mongoose.model('user', userSchema)


// Export the Model
module.exports = UserClass
