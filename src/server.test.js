import request from 'supertest';
import app from './server';

test(`GET '/' should return 200`, async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
});

test('POST \'/:shortUrl\' should return 200', async () => {
  const payload = { fullUrl: 'https://stackoverflow.com/questions/55424501/passing-request-body-to-post-using-super-test' }
  const response = 
  await request(app)
  .post('/shortUrl')
  .send(new URLSearchParams(payload).toString())
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .set('Accept', 'application/x-www-form-urlencoded');
  expect(response.status).toBe(302);
});

test('GET \'/:shortenedUrl should return 302', async () => {
    const response =
    await request(app)
    .get('/dvkmy_9j6');
    expect(response.status).toBe(302);
})