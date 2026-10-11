const request = require('supertest');
const app = require('../app');

describe('GET /api/health', () => {
  it('responds with status 200 and success true', async () => {
    const res = await request(app).get('/api/health').expect(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message');
  });
});
