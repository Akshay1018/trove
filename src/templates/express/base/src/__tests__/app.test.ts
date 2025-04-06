import request from 'supertest';
import app from '../app';

describe('App', () => {
  it('should respond with 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', 'Route /unknown-route not found');
  });

  it('should handle JSON parsing errors', async () => {
    const response = await request(app)
      .post('/api/some-endpoint')
      .set('Content-Type', 'application/json')
      .send('invalid json');
    
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('status', 'error');
  });
}); 