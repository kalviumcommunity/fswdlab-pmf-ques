const { AppError, asyncHandler, notFoundHandler, errorHandler } = require('./index');

describe('PMF 3 - Safe Error Flow', () => {
  function mockRes() {
    return {
      statusCode: null,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      }
    };
  }

  it('1. AppError stores the provided message', () => {
    const err = new AppError('Shipment not found', 404);
    expect(err.message).toBe('Shipment not found');
  });

  it('2. AppError stores the provided statusCode', () => {
    const err = new AppError('Shipment not found', 404);
    expect(err.statusCode).toBe(404);
  });

  it('3. AppError marks itself as operational', () => {
    const err = new AppError('Shipment not found', 404);
    expect(err.isOperational).toBeTrue();
  });

  it('4. asyncHandler forwards rejected async errors to next', async () => {
    const next = jasmine.createSpy('next');
    const wrapped = asyncHandler(async () => {
      throw new Error('boom');
    });
    await wrapped({}, {}, next);
    expect(next).toHaveBeenCalled();
    expect(next.calls.argsFor(0)[0].message).toBe('boom');
  });

  it('5. asyncHandler does not call next on success', async () => {
    const next = jasmine.createSpy('next');
    const wrapped = asyncHandler(async () => 'ok');
    await wrapped({}, {}, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('6. notFoundHandler forwards a 404 AppError', () => {
    const next = jasmine.createSpy('next');
    notFoundHandler({ originalUrl: '/missing' }, {}, next);
    const err = next.calls.argsFor(0)[0];
    expect(err instanceof AppError).toBeTrue();
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Route not found: /missing');
  });

  it('7. errorHandler returns AppError status and message', () => {
    const res = mockRes();
    errorHandler(new AppError('Forbidden zone', 403), {}, res, () => {});
    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ error: 'Forbidden zone' });
  });

  it('8. errorHandler hides plain Error messages behind a safe 500', () => {
    const res = mockRes();
    errorHandler(new Error('db password leaked'), {}, res, () => {});
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Internal Server Error' });
  });

  it('9. errorHandler response contains only the safe error field', () => {
    const res = mockRes();
    const err = new Error('sensitive');
    err.stack = 'secret stack';
    errorHandler(err, {}, res, () => {});
    expect(Object.keys(res.body)).toEqual(['error']);
  });

  it('10. end-to-end flow works: async throw -> next -> errorHandler', async () => {
    const req = {};
    const res = mockRes();
    let captured;
    const next = (err) => { captured = err; };
    const wrapped = asyncHandler(async () => {
      throw new AppError('Shipment missing', 404);
    });
    await wrapped(req, res, next);
    errorHandler(captured, req, res, () => {});
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'Shipment missing' });
  });
});
