const request = require('supertest');
const app = require('../app');

describe('Park Endpoints', () => {

	test('get all the parks', async () => {
		const res = await request(app).get('/park')
		expect(res.statusCode).toEqual(200)
		expect(res.body).toBeTruthy();
	})

	test('get all park by valid plateNo', async () => {
		const res = await request(app).get('/park/PP-1229C')
		expect(res.body).toBeTruthy();
	})

	test('get all park by invalid plateNo', async () => {
		const res = await request(app).get('/park/PP-1229S')
		expect(res.body).toBeTruthy();
	})

	test('get all available park by carSize - S', async () => {
		const res = await request(app).get('/park/available/S')
		expect(res.body).toBeTruthy();
	})

	test('get all available park by carSize - M', async () => {
		const res = await request(app).get('/park/available/M')
		expect(res.body).toBeTruthy();
	})

	test('get all available park by carSize - L', async () => {
		const res = await request(app).get('/park/available/L')
		expect(res.body).toBeTruthy();
	})

	test('get all available park by invalid carSize', async () => {
		const res = await request(app).get('/park/available/N')
		expect(res.body).toBeTruthy();
	})

	test('get all available park by invalid carSize', async () => {
		const res = await request(app).get('/park/signup')
		expect(res.body).toBeTruthy();
	})

	test('sign up for new car - invalid data', async () => {
		const res = await request(app).post('/park/signup')
			.send({ carSize: "B", plateNumber: "123456789", contactNumber: "1234567989" })
		expect(res.body).toBeTruthy();
	})

	test('sign up for new car - valid data', async () => {
		const res = await request(app).post('/park/signup')
			.send({ carSize: "S", plateNumber: "ABC-1234", contactNumber: "1234567989" })
		expect(res.body).toBeTruthy();
	})

	test('park by unavailable slot', async () => {
		const res = await request(app).post('/park')
			.send({ plateNumber: "PP-1229C", slotId: "PS-123", carSize: "S" })
		expect(res.body).toBeTruthy();
	})

	test('park by unavailable slot', async () => {
		const res = await request(app).post('/park')
			.send({ plateNumber: "PP-1229C", slotId: "PS-123", carSize: "M" })
		expect(res.body).toBeTruthy();
	})

})

