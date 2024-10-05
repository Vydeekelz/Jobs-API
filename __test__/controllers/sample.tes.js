const request = require('supertest');
const app = require('../../app'); // Your Express app
const Job = require('../../models/Job');
const auth = require('../../middleware/authentication');

// Mock the Job model
jest.mock('../../models/Job');

// Mock the authentication middleware
jest.mock('../../middleware/authentication', () => jest.fn((req, res, next) => {
  // Check if the request has an Authorization header
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Authentication invalid' });
  }
  
  // Mocked payload for authenticated user
  req.user = { userId: 'mocked-user-id' };
  next();
}));

describe('GET /api/v1/jobs', () => {
  it('should return all jobs for an authenticated user', async () => {
    // Mock the Job.find method to return some fake jobs
    Job.find.mockResolvedValue([
      {
        _id: 'job-id-1',
        company: 'Company A',
        position: 'Developer',
        createdBy: 'mocked-user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'job-id-2',
        company: 'Company B',
        position: 'Manager',
        createdBy: 'mocked-user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const res = await request.agent(app)
      .get('/api/v1/jobs')
      .set('Authorization', 'Bearer mocked-token'); // Mocked token

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
});
