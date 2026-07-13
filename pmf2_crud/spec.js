const request = require('supertest');
const { app, tasks, resetState } = require('./index');

describe('PMF 2 - Full CRUD Tasks API', () => {
  beforeEach(() => {
    resetState();
  });

  it('1. GET /tasks returns all tasks wrapped in data', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: tasks });
  });

  it('2. POST /tasks rejects invalid create input with 400', async () => {
    const res = await request(app).post('/tasks').send({ title: '  ', status: 'urgent', assignee: '' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'valid title, status, and assignee are required' });
  });

  it('3. POST /tasks creates a new task with 201', async () => {
    const res = await request(app).post('/tasks').send({ title: 'Ship report', status: 'done', assignee: 'Nia' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ data: { id: 3, title: 'Ship report', status: 'done', assignee: 'Nia' } });
  });

  it('4. GET /tasks/:id returns a single matching task', async () => {
    const res = await request(app).get('/tasks/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: { id: 1, title: 'Prepare deck', status: 'todo', assignee: 'Asha' } });
  });

  it('5. GET /tasks/:id returns 404 when the task is missing', async () => {
    const res = await request(app).get('/tasks/999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Task not found' });
  });

  it('6. PUT /tasks/:id fully replaces an existing task', async () => {
    const res = await request(app).put('/tasks/1').send({ title: 'Prepare final deck', status: 'doing', assignee: 'Riya' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: { id: 1, title: 'Prepare final deck', status: 'doing', assignee: 'Riya' } });
  });

  it('7. PUT /tasks/:id rejects invalid replacement input with 400', async () => {
    const res = await request(app).put('/tasks/1').send({ title: '', status: 'doing', assignee: 'Riya' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'valid title, status, and assignee are required' });
  });

  it('8. PATCH /tasks/:id updates only provided valid fields', async () => {
    const res = await request(app).patch('/tasks/2').send({ status: 'done' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: { id: 2, title: 'Review API contract', status: 'done', assignee: 'Kabir' } });
  });

  it('9. DELETE /tasks/:id removes an existing task with 204', async () => {
    const res = await request(app).delete('/tasks/1');
    expect(res.status).toBe(204);
    expect(res.text).toBe('');
    expect(tasks).toEqual([{ id: 2, title: 'Review API contract', status: 'doing', assignee: 'Kabir' }]);
  });

  it('10. DELETE /tasks/:id returns 404 when the task is missing', async () => {
    const res = await request(app).delete('/tasks/999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Task not found' });
  });
});
