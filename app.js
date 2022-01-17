/**
 * Entry file: app.js
 * author: oprado
 */
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./src/config/');
const UserService = require('./src/services/user-service');
const asyncCatch = require('./src/utils/async-handler.util');
const cors = require('cors');

// API Version 1.0.0
const apisV1 = require('./src/apis/v1');

// Load mongoose package
const mongoose = require('mongoose');

// Use native Node promises
mongoose.Promise = global.Promise;

// Connect to MongoDB
mongoose.connect(config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => { console.log("Successfully connected to the database."); })
	.catch(err => {
		console.log("Could not connect to the database.", err);
		process.exit();
	});

// Express
const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'src')));

// API Endpoints
app.use('/v1/', apisV1);

// Error handler
app.use('*', asyncCatch(UserService.err404));
app.use(asyncCatch(UserService.err500));

app.listen(config.port, () => {
	console.log("Server is listening on port", config.port);
});

module.exports = app;