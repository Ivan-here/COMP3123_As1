const express = require('express');

const userRouter = require('./routes/user.routes');
const empRouter  = require('./routes/employee.routes');

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

// Mount routers (no CORS/morgan)
app.use('/api/v1/user', userRouter);
app.use('/api/v1/emp',  empRouter);

// 404 + basic error JSON
app.use((req, res) => res.status(404).json({ status: false, message: 'Route not found' }));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({ status: false, message: err.message || 'Server Error' });
});

module.exports = app;