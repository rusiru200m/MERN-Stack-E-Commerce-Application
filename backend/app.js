const express = require('express');
const cors = require('cors');

const userRoutes = require('./src/modules/users/user.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
	res.json({ message: 'API is running' });
});

app.use('/api/users', userRoutes);

app.use((req, res) => {
	res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
	console.error(error);
	res.status(error.statusCode || 500).json({
		message: error.message || 'Internal server error',
	});
});

module.exports = app;
