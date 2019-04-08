// all imports
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('./logger');
const dotenv = require('dotenv');
dotenv.config();
//--------------------------------------------------------------------//


// importing all routes files
const routes = require('./api/routes/routes');
//--------------------------------------------------------------------//


// setting up morgan(HTTP request logger middleware for node.js)
if (process.env.NODE_ENV == 'development') {
	app.use(morgan('dev'));
	console.log('morgan & logger: ON');
} else {
	console.log('morgan & logger: OFF');
}
//--------------------------------------------------------------------//

// making public folder available through route
app.use('/public/', express.static('public'));
app.use('/', express.static('vue_client/dist'));

// setting up body-parser
// support for parsing applicationCache/json type post data
app.use(bodyParser.json());

// support for parsing of applicationCache/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
	extended: true,
	limit: '4MB'
}));
// handeling CORS error
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});
//--------------------------------------------------------------------//


//setting up all routes 
// routes
app.use('/api', routes);
//--------------------------------------------------------------------//


// serving index.html file
// app.get('/', function (req, res) {
// 	res.sendFile(path.join(__dirname + '/vue_client/dist/index.html'));
// });


// setting up database (mongoDB with mongoose)
mongoose.connect(process.env.DATABASE_URL, {
		useNewUrlParser: true,
		useCreateIndex: true
	})
	.then(() => logger.log('info','connected to Mongodb'))
	.catch(err => logger.log('info',`databse error: ${err}`));
//--------------------------------------------------------------------//



//setting up error handling if no routes full fill request
app.use((req, res, next) => {
	const error = new Error('No Routes Found!');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
    message: error.message,
		error: error.error || 'server internal error'
	});
});
//--------------------------------------------------------------------//

//exporting the module
module.exports = app;