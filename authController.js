const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let student = await Student.findOne({ email });
        if (student) return res.status(400).json({ msg: 'Student already exists' });

        student = new Student({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(password, salt);
        await student.save();

        const payload = { student: { id: student.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.json({ token });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let student = await Student.findOne({ email });
        if (!student) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const payload = { student: { id: student.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.json({ token });
    } catch (err) {
        res.status(500).send('Server error');
    }
};
