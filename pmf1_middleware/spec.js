const request = require('supertest');
const { app, notes, requestLogs, timingLogs, attachRequestId, logger, timing, requireWriteAccess, resetState } = require('./index');

describe('PMF 1 - Request Tracing Pipeline', () => {
  beforeEach(() => {
    resetState();
  });

  it('1. attachRequestId adds a generated id to req', () => {
    const req = {};
    const res = { setHeader() {} };
    const next = jasmine.createSpy('next');
    attachRequestId(req, res, next);
    expect(req.id).toBe('req-1');
  });

  it('2. attachRequestId also sets X-Request-Id on the response', () => {
    const req = {};
    const res = { headers: {}, setHeader(name, value) { this.headers[name] = value; } };
    const next = jasmine.createSpy('next');
    attachRequestId(req, res, next);
    expect(res.headers['X-Request-Id']).toBe('req-1');
    expect(next).toHaveBeenCalled();
  });

  it('3. logger records method, path, and final status', async () => {
    await request(app).get('/notes');
    expect(requestLogs[0].includes('GET /notes 200')).toBeTrue();
  });

  it('4. logger includes the request id in the log line', async () => {
    await request(app).get('/notes');
    expect(requestLogs[0].startsWith('[req-1]')).toBeTrue();
  });

  it('5. timing records a duration entry after the response finishes', async () => {
    await request(app).get('/notes');
    expect(timingLogs.length).toBe(1);
    expect(timingLogs[0].includes('GET /notes took')).toBeTrue();
  });

  it('6. timing also includes the request id in the timing line', async () => {
    await request(app).get('/notes');
    expect(timingLogs[0].startsWith('[req-1]')).toBeTrue();
  });

  it('7. requireWriteAccess blocks POST /notes without the required header', async () => {
    const res = await request(app).post('/notes').send({ text: 'New note' });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized' });
  });

  it('8. global middleware order allows tracing on normal read requests', async () => {
    const res = await request(app).get('/notes');
    expect(res.headers['x-request-id']).toBe('req-1');
    expect(requestLogs.length).toBe(1);
    expect(timingLogs.length).toBe(1);
  });

  it('9. POST /notes creates a note only when the guard passes', async () => {
    const res = await request(app)
      .post('/notes')
      .set('x-write-key', 'allow-write')
      .send({ text: 'New note' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ data: { id: 3, text: 'New note' } });
  });

  it('10. GET /traces returns both requestLogs and timingLogs together', async () => {
    await request(app).get('/notes');
    const res = await request(app).get('/traces');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.requestLogs)).toBeTrue();
    expect(Array.isArray(res.body.data.timingLogs)).toBeTrue();
    expect(res.body.data.requestLogs[0].includes('GET /notes 200')).toBeTrue();
    expect(res.body.data.timingLogs[0].includes('GET /notes took')).toBeTrue();
  });
});
