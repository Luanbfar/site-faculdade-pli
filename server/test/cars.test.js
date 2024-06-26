// test/cars.test.js
const request = require('supertest');
const express = require('express');
const mysql = require('mysql2');
const carsRouter = require('../routes/cars-routes'); 

const app = express();
app.use(express.json());
app.use('/api', carsRouter);

jest.mock('mysql2', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return {
    createConnection: jest.fn(() => mClient),
  };
});

describe('GET /cars', () => {
  let db;

  beforeAll(() => {
    db = mysql.createConnection();
  });

  it('should return all cars', async () => {
    const mockCars = [
      { id: 1, name: 'Car 1', price: 10000, quantity: 10 },
      { id: 2, name: 'Car 2', price: 20000, quantity: 5 }
    ];

    db.query.mockImplementation((query, callback) => {
      callback(null, mockCars);
    });

    const response = await request(app)
      .get('/api/cars')
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCars);
  });

  it('should return 404 if no cars are found', async () => {
    db.query.mockImplementation((query, callback) => {
      callback(null, []);
    });

    const response = await request(app)
      .get('/api/cars')
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Not found' });
  });

  it('should return 500 on database error', async () => {
    db.query.mockImplementation((query, callback) => {
      callback(new Error('Database error'), null);
    });

    const response = await request(app)
      .get('/api/cars')
      .set('Accept', 'application/json');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Database error' });
  });
});
