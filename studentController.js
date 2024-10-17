const Student = require('../models/Student');
const multer = require('multer');
const path = require('path');

// File upload configuration
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${req.student.id}-${Date.now()}${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage }).single('file');

exports.getProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.student.id).select('-password');
        res.json(student);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.updateProfile = async (req, res) => {
    const { name, email } = req.body;
    try {
        const student = await Student.findById(req.student.id);
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        student.name = name || student.name;
        student.email = email || student.email;
        await student.save();
        res.json(student);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.uploadFile = (req, res) => {
    upload(req, res, (err) => {
        if (err) return res.status(500).json({ msg: 'File upload failed' });
        res.json({ filePath: `/uploads/${req.file.filename}` });
    });
};

exports.readFile = (req, res) => {
    const filePath = `./uploads/${req.params.filename}`;
    res.sendFile(path.resolve(filePath));
};

exports.deleteFile = (req, res) => {
    const filePath = `./uploads/${req.params.filename}`;
    fs.unlink(filePath, (err) => {
        if (err) return res.status(500).json({ msg: 'File deletion failed' });
        res.json({ msg: 'File deleted' });
    });
};
