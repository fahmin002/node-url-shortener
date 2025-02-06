import request from 'supertest';
import app from './server';
const fullUrlExample = process.env.fullUrl
const shortUrlExample = process.env.shortUrl

test(`GET '/' should return 200`, async () => {
  // request home page, and return 200 as status code, it's mean home page successfully rendered
  const response = await request(app).get('/');
  expect(response.status).toBe(200);
});

test('POST \'/:shortUrl\' should return 200', async () => {
  // prepared payload for body, to send into server
  const payload = { fullUrl: fullUrlExample }
  // post request, convert object into url string for send to server as x-www-form-urlencoded
  const response = 
  await request(app)
  .post('/shortUrl')
  .send(new URLSearchParams(payload).toString())
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .set('Accept', 'application/x-www-form-urlencoded');
  // expect the server will redirect the page to home page
  expect(response.status).toBe(302);
});

// expect server will redirect the page to real url
test('GET \'/:shortenedUrl should return 302', async () => {
    const response =
    await request(app)
    .get(`/${shortUrlExample}`);
    expect(response.status).toBe(302);
})