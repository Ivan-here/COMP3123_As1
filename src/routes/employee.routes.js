const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { Employee } = require('../models');

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

router.post('/employees', [
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
            const emp = await Employee.create(req.body);
            res.status(201).json({ message: 'Employee created successfully.', employee_id: emp._id.toString() });
        } catch (e) {
            if (e.code === 11000) return res.status(409).json({ status:false, message:'Employee email already exists' });
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

router.put('/employees/:eid',
    [ param('eid').isMongoId() ],
    async (req, res, next) => {
    if (valid(req, res)) return;
    try {
        const upd = await Employee.findByIdAndUpdate(req.params.eid, { $set: req.body }, { new: true });
        if (!upd) return res.status(404).json({ status:false, message:'Employee not found' });
        res.status(200).json({ message: 'Employee details updated successfully.' });
    } catch (e) { next(e); }
});

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