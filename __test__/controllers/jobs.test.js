const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app'); // Your Express app
const start = require('../../server')
const User = require('../../models/User');
const Job = require('../../models/Job');
const jwt = require('jsonwebtoken');


jest.setTimeout(30000);
describe('Testing Jobs controllers', () => {
  let token;
  let userId;
  let jobsDB;
  let jobId;

  beforeAll(async () => {
    // Set up database connection
    await mongoose.connect(process.env.MONGO_URI_TEST);

    // Create a test user
    const user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'testpassword' // Assume hashing is done in a pre-save hook
    });
    userId = user._id;

    // Generate a JWT token
    token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create some jobs associated with the user
    jobsDB = await Job.create([
      {
        company: 'Company A',
        position: 'Developer',
        createdBy: userId
      }]
    );

    jobsDB = await Job.create([
      {
        company: 'Company B',
        position: 'Manager',
        createdBy: userId
      }]
    );
  });

  afterAll(async () => {
    // Clean up the database
    await User.deleteMany({});
    await Job.deleteMany({});
    await mongoose.connection.close(); // Close the database connection
  });

  describe('Get all jobs', () =>{

    it('should return all jobs for an authenticated user', async () => {
      const res = await request(app)
      .get('/api/v1/jobs')
      .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.jobs).toHaveLength(2);
      expect(res.body.jobs[0]).toHaveProperty('company', 'Company A');
      expect(res.body.jobs[1]).toHaveProperty('position', 'Manager');
      expect(res.body).toHaveProperty('count', 2);
    });
    
    it('should return 401 if the user is not authenticated', async () => {
      const res = await request(app).get('/api/v1/jobs');
      
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('msg', 'Authentication invalid');
    });
    
  })

  describe('create new job', () =>{

    it('should create new job for the authenticated user', async () => {
      const res = await request(app)
      .post('/api/v1/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        company: 'Company C',
        position: 'Intern',
        createdBy: userId
      })
      
      expect(res.statusCode).toBe(201);
      expect(res.body.job).toHaveProperty('company', 'Company C');
      expect(typeof res.body.job).toBe('object');
    });
    
    it('should return 401 if the user is not authenticated', async () => {
      const res = await request(app).post('/api/v1/jobs');
      
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('msg', 'Authentication invalid');
    });
    
  })

  describe("Update job '/api/v1/jobs/:id' ", () =>{
    const editedData = {status: 'Employed'}

    it('should edit a single job for an authenticated user based on provided id', async () => {
      jobId = jobsDB[0]._id;
      const res = await request(app)
      .patch(`/api/v1/jobs/${jobId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(editedData);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'Employed');
      expect(typeof res.body).toBe('object');
    });
    
    it('should return 404 and empty array if the job id is not found', async () => {
      jobId = "66ff6b2229c1a11118ddb634" 
      const res = await request(app)
      .patch(`/api/v1/jobs/${jobId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(editedData);
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('msg', `No job found with ID ${jobId}`);
    });

    it('should return 401 if the user is not authenticated', async () => {
      const res = await request(app).patch('/api/v1/jobs/1');
      
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('msg', 'Authentication invalid');
    });
    
  })
  
  describe("Get single job '/api/v1/jobs/:id' ", () =>{

    it('should return a single job for an authenticated user based on provided id', async () => {
      jobId = jobsDB[0]._id
      const res = await request(app)
      .get(`/api/v1/jobs/${jobId}`)
      .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.job).toHaveProperty('_id', jobId.toString());
      expect(typeof res.body.job).toBe('object');
    });
    
    it('should return 404 and empty array if the job id is not found', async () => {
      jobId = "66ff6b2229c1a11118ddb634" 
      const res = await request(app)
      .get(`/api/v1/jobs/${jobId}`)
      .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('msg', `no job with job ID ${jobId}`);
    });

    it('should return 401 if the user is not authenticated', async () => {
      const res = await request(app).get('/api/v1/jobs/1');
      
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('msg', 'Authentication invalid');
    });
    
  })

  describe("Delete job '/api/v1/jobs/:id' ", () =>{

    it('should delete a single job for an authenticated user based on provided id', async () => {
      jobId = jobsDB[0]._id
      const res = await request(app)
      .delete(`/api/v1/jobs/${jobId}`)
      .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.job).toHaveProperty('_id', jobId.toString());
      expect(typeof res.body.job).toBe('object');
    });
    
    it('should return 404 and empty array if the job id is not found', async () => {
      jobId = "66ff6b2229c1a11118ddb634" 
      const res = await request(app)
      .delete(`/api/v1/jobs/${jobId}`)
      .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('msg', `no job with job ID ${jobId}`);
    });

    it('should return 401 if the user is not authenticated', async () => {
      const res = await request(app).delete('/api/v1/jobs/1');
      
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('msg', 'Authentication invalid');
    });
    
  })


});
