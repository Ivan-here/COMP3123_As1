const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { Employee } = require('../models');
const upload = require('../upload.js');

const router = express.Router();
const valid = (req, res) => {
    const e = validationResult(req);
    return e.isEmpty() ? null : res.status(400).json({ status:false, errors: e.array() });
};

router.get('/employees',async (req, res, next) => {
    try {
        const list = await Employee.find().lean();
        res.status(200).json(list.map(({ _id, ...rest }) => ({ employee_id: _id, ...rest })));
    } catch (e) { next(e); }
});

router.get('/employees/search', async (req, res, next) => {
    try {
        const { department } = req.query;
        const filter = {};

        if (department) {
            filter.department = new RegExp(department, 'i');
        }

        const employees = await Employee.find(filter).lean();
        const list = employees.map(({ _id, ...rest }) => ({
            employee_id: _id,
            ...rest,
        }));

        res.status(200).json(list);
    } catch (err) {
        next(err);
    }
});

router.post('/employees',
    upload.single('profileImage'),
    [
        body('first_name').notEmpty(),
        body('last_name').notEmpty(),
        body('email').isEmail(),
        body('position').notEmpty(),
        body('salary').isFloat({ min: 0 }),
        body('date_of_joining').isISO8601().toDate(),
        body('department').notEmpty(),
    ],
    async (req, res, next) => {
        if (valid(req, res)) return;
        try {
            const data = { ...req.body };

            if (req.file) {
                data.profileImage = `/uploaded/${req.file.filename}`;
            }

            const emp = await Employee.create(data);   // ✅ use data
            res.status(201).json({
                message: 'Employee created successfully.',
                employee_id: emp._id.toString()
            });
        } catch (e) {
            if (e.code === 11000)
                return res.status(409).json({ status:false, message:'Employee email already exists' });
            next(e);
        }
    }
);

router.get('/employees/:eid',
    [param('eid').isMongoId()],
    async (req, res, next) => {
    if (valid(req, res)) return;
    try {
        const emp = await Employee.findById(req.params.eid).lean();
        if (!emp) return res.status(404).json({ status:false, message:'Employee not found' });
        const { _id, ...rest } = emp;
        res.status(200).json({ employee_id: _id, ...rest });
    } catch (e) { next(e); }
});

router.put(
    '/employees/:eid',
    upload.single('profileImage'),
    [
        param('eid').isMongoId(),
        body('first_name').optional().notEmpty(),
        body('last_name').optional().notEmpty(),
        body('email').optional().isEmail(),
        body('position').optional().notEmpty(),
        body('salary').optional().isFloat({ min: 0 }).toFloat(),
        body('date_of_joining').optional().isISO8601().toDate(),
        body('department').optional().notEmpty(),
    ],
    async (req, res, next) => {
        if (valid(req, res)) return;
        try {
            const updateData = { ...req.body };

            if (req.file) {
                updateData.profileImage = `/uploaded/${req.file.filename}`;
            }
            const upd = await Employee.findByIdAndUpdate(
                req.params.eid,
                { $set: updateData },
                { new: true }
            );
            if (!upd) {
                return res
                    .status(404)
                    .json({ status: false, message: 'Employee not found' });
            }
            res.status(200).json({ message: 'Employee details updated successfully.' });
        } catch (e) {
            next(e);
        }
    }
);

router.delete('/employees',
    [query('eid').isMongoId()],
    async (req, res, next) => {
    if (valid(req, res)) return;
    try {
        const del = await Employee.findByIdAndDelete(req.query.eid);
        if (!del) return res.status(404).json({ status:false, message:'Employee not found' });
        res.status(204).send();
    } catch (e) { next(e); }
});


module.exports = router;