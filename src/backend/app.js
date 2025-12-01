const express = require('express');
const path = require("path");

const userRouter = require('./routes/user.routes');
const empRouter  = require('./routes/employee.routes');
const cors = require('cors');

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(express.json());

app.use(
    "/uploaded",
    express.static(path.join(__dirname, "uploaded"))
);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/v1/user', userRouter);
app.use('/api/v1/emp',  empRouter);

app.use((req, res) => res.status(404).json({ status: false, message: 'Route not found' }));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({ status: false, message: err.message || 'Server Error' });
});

module.exports = app;