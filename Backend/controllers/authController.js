const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Configurable via environment variables
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.signup = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const validRoles = ['Manager', 'Dispatcher', 'SafetyOfficer', 'FinancialAnalyst'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    try {
        const existing = await db.query('SELECT id FROM Users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const result = await db.query(
            `INSERT INTO Users (name, email, password_hash, role) 
       VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at`,
            [name, email, passwordHash, role]
        );

        res.status(201).json({
            message: 'User created successfully',
            user: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during signup' });
    }
};

exports.login = async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    try {
        const result = await db.query('SELECT * FROM Users WHERE email = $1 AND role = $2', [email, role]);
        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ error: 'Invalid email, password, or role' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email, password, or role' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

        // Store hashed OTP in temporary token instead of plain OTP
        const tempToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role, otpHash },
            process.env.JWT_SECRET || 'hackathon_secret',
            { expiresIn: '10m' }
        );

        // Send Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Your Login OTP',
            text: `Your OTP for login is: ${otp}. It is valid for 10 minutes.`
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`OTP email sent to ${user.email}`);
        } catch (mailErr) {
            console.error('Email could not be sent. Check your NodeMailer configuration.', mailErr);
            // Log OTP during development if email fails
            console.log(`Generated OTP for ${user.email}:`, otp);
        }

        res.json({
            message: 'OTP sent successfully',
            requiresOtp: true,
            tempToken
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during login' });
    }
};

exports.verifyOtp = async (req, res) => {
    const { otp, tempToken } = req.body;

    if (!otp || !tempToken) {
        return res.status(400).json({ error: 'OTP and temporary token are required' });
    }

    try {
        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET || 'hackathon_secret');

        const providedOtpHash = crypto.createHash('sha256').update(otp).digest('hex');
        if (providedOtpHash !== decoded.otpHash) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // Issue actual auth token
        const token = jwt.sign(
            { id: decoded.id, email: decoded.email, role: decoded.role },
            process.env.JWT_SECRET || 'hackathon_secret',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Logged in successfully',
            token,
            user: {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role
            }
        });
    } catch (err) {
        console.error(err);
        if (err.name === 'TokenExpiredError') {
            return res.status(400).json({ error: 'OTP has expired' });
        }
        res.status(400).json({ error: 'Invalid or expired temporary token' });
    }
};
