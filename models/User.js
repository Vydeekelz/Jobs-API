const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'please provide name'],
      minlength: 3
    },
    email: {
      type: String,
      required: [true, 'please provide email'],
      minlength: 3,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'please provide password'],
      minlength: 8, // Minimum 8 characters
      match: [
          /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          'Password must be at least 8 characters long, including at least one uppercase letter, one number, and one special character.'
      ],
  },
  
    
  }
)

UserSchema.pre('save', async function() {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.email = this.email.toLowerCase();
});


UserSchema.methods.createJWT= function () {
  return jwt.sign({userId: this._id, name : this.name }, process.env.JWT_SECRET , {expiresIn: process.env.JWT_LIFETIME,
})
}

UserSchema.methods.comparePassword = async function (password) {
  isMatch = await bcrypt.compare(password, this.password)
  return isMatch
}

module.exports = mongoose.model('User', UserSchema)