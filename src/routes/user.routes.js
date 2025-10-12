const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');

const router = express.Router();

const valid = (req, res) => {
    const e = validationResult(req);
    return e.isEmpty() ? null : res.status(400).json({ status:false, errors: e.array() });
};

router.post('/signup', [
        body('username').notEmpty().withMessage('username required'),
        body('email').isEmail().withMessage('valid email required'),
        body('password').isLength({ min: 6 }).withMessage('password min 6 chars'),
    ],
    async (req, res, next) => {
        if (valid(req, res)) return;
        try {
            const { username, email, password } = req.body;
            const exists = await User.findOne({ $or: [{ email }, { username }] });
            if (exists) return res.status(409).json({ status:false, message:'User already exists' });

            const hash = await bcrypt.hash(password, 10);
            const u = await User.create({ username, email, password: hash });

            res.status(201).json({ message: 'User created successfully.', user_id: u._id.toString() });
        } catch (e) { next(e); }
    }
);

router.post('/login', [
        body('password').notEmpty(),
        body('email').optional().isEmail(),
        body('username').optional().notEmpty(),
    ],
    async (req, res, next) => {
        if (valid(req, res)) return;
        try {
            const { email, username, password } = req.body;
            const u = await User.findOne(email ? { email } : { username });
            if (!u || !(await bcrypt.compare(password, u.password))) {
                return res.status(401).json({ status:false, message:'Invalid Username or password' });
            }
            const token = process.env.JWT_ENABLED === 'true'
                ? jwt.sign({ id: u._id.toString(), email: u.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
                : null;

            res.status(200).json({ message: 'Login successful.', ...(token ? { jwt_token: token } : {}) });
        } catch (e) { next(e); }
    }
);

module.exports = router;