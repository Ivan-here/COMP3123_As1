const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true, unique: true },
    email:    { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

const employeeSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, lowercase: true, unique: true },
    position: String,
    salary: Number,
    date_of_joining: Date,
    department: String
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

module.exports = {
    User: mongoose.model('User', userSchema),
    Employee: mongoose.model('Employee', employeeSchema),
};