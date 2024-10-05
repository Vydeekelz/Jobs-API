const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../../models/User')
const app = require('../../app')
// const start = require("../../server");
// let myServer;

beforeAll(async () => {
  // myServer = await start() ; 
  jest.spyOn(console, 'log').mockImplementation(()=>{})
})

// afterAll(async () => {
//   await myServer.close(); //close the server connection
//   await mongoose.connection.close(); //close the database connection
// })

jest.setTimeout(10000);
jest.mock('../../models/User')


describe('register new user', () => {
  it('should register a new user and return a token', async () => {

    User.create.mockResolvedValue({
      _id: '615c1f9f1c4a1a001c3d1234', // Typically, the database generated ID
      name: 'John',
      email: 'John@gmail.com',
      password: 'hashed-password', // The password would typically be hashed
      createJWT: () => 'mocked-jwt-token',
    })
    const res = await request(app).post('/api/v1/auth/register').send({name: "John", email: "John@gmail.com", password: "secret"});

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');

    
  })

  it('returns bad request if any paramater is missing', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({name: "John", email: "John@gmail.com", password: ""});

    expect(res.statusCode).toEqual(400);
    expect(res.body.msg).toEqual("please provide email and password")
    })
})


describe('User login', () => {
  it('should log  a user in and return a token', async () => {

    User.findOne.mockResolvedValue({
      _id: '615c1f9f1c4a1a001c3d1234', // Typically, the database generated ID
      name: 'John',
      email: 'John@gmail.com',
      password: 'hashed-password', // The password would typically be hashed
      createJWT: () => 'mocked-jwt-token',
      comparePassword: () => true ,
    })
    jest.mock('../../models/User', () => ({

    }))


    const res = await request(app).post('/api/v1/auth/login').send({name: "John", email: "John@gmail.com", password: "secret"});

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');

    
  })

  it('returns bad request if any paramater is missing', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({name: "John", email: "John@gmail.com", password: ""});

    expect(res.statusCode).toEqual(400);
    expect(res.body.msg).toEqual("please provide email and password")
    })
})
