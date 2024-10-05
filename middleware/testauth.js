const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')

const testauth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid');
  }

  const token = authHeader.split(' ')[1];
  // try {
  //   payload = jwt.verify(token, process.env.JWT_SECRET);
  //   req.user = {userId: payload.userId, name: payload.name};
  //   next();
    
  // } catch (error) {
  //   console.log(error)
  //   throw new UnauthenticatedError('Authentication invalid');
  // }
  next();
} 

module.exports = testauth