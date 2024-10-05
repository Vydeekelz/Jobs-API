const User = require('../models/User');
const {BadRequestError} = require('../errors')
const {UnauthenticatedError} = require('../errors')

const {StatusCodes} = require('http-status-codes');

const register = async (req, res) => {
  const {email, password}  = req.body;
  if (!email || !password) {
    throw new BadRequestError('please provide email and password')
  }
  const user = await User.create({...req.body});
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: {name: user.name}, token})
}

const login = async (req, res) => {
  const {email, password}  = req.body;
  if (!email || !password) {
    throw new BadRequestError('please provide email and password')
  }
  const user = await User.findOne({email});

  if (!user){
    throw new UnauthenticatedError('Please provide valid credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Please provide valid credentials')
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({user: {name: user.name}, token})
  
}

module.exports = {register, login}