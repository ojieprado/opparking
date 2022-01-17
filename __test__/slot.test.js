const request = require('supertest');
const app = require('../app');

describe('Slot Endpoints', () => {

	test('should get all the slots', async () => {
		const res = await request(app).get('/slot')
		expect(res.statusCode).toEqual(200)
		expect(res.body).toBeTruthy();
	})

	test('get all the slots by slotStatus', async () => {
		const res = await request(app).get('/slot/available')
		expect(res.body).toBeTruthy();
	})

	test('get all the slots by slotStatus & slotSize', async () => {
		const res = await request(app).get('/slot/unavailable/SP')
		expect(res.body).toBeTruthy();
	})

	test('get all the slots by slotStatus & slotSize', async () => {
		const res = await request(app).get('/slot/unavailable/SP')
		expect(res.body).toBeTruthy();
	})

	test('get all the slots by slotStatus & slotSize', async () => {
		const res = await request(app).get('/slot/unavailable/SP')
		expect(res.body).toBeTruthy();
	})

	test('add new slot with invalid data', async () => {
		const res = await request(app).post('/slot')
			.send({ slotId: 'PS-143', slotSize: 'N', slotFee: 100 })
		expect(res.body).toBeTruthy();
	})

	test('add new slot with valid data', async () => {
		const res = await request(app).post('/slot')
			.send({ slotId: 'PS-143', slotSize: 'SP', slotFee: 100 })
		expect(res.body).toBeTruthy();
	})

	test('edit slotFee by slotSize with invalid data', async () => {
		const res = await request(app).patch('/slot')
			.send({ slotSize: 'N', slotFee: 100 })
		expect(res.body).toBeTruthy();
	})

	test('edit slotFee by slotSize with valid data', async () => {
		const res = await request(app).patch('/slot')
			.send({ slotSize: 'SP', slotFee: 100 })
		expect(res.body).toBeTruthy();
	})
})

