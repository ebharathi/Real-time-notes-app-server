const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const responseFormatter = require('../utils/FormatResponse');


const signup = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(200).json(responseFormatter({
                error: true,
                message: 'User already exists',
            }));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            'INSERT INTO users (email,name,password) VALUES ($1, $2, $3) RETURNING id, email',
            [email, name, hashedPassword]
        );
        console.log("NEW USER CREATED[+]");

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.rows[0].id, email: newUser.rows[0].email },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        return res.status(201).json(responseFormatter({
            error: false,
            message: 'User registered successfully',
            data: { token, user: newUser.rows[0] }
        }));
    } catch (error) {
        console.error("ERROR SIGNING UP:", error);
        return res.status(500).json(responseFormatter({
            error: true,
            message: 'Internal server error',
        }));
    }
}

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length === 0) {
            return res.status(200).json(responseFormatter({
                error: true,
                message: 'Invalid credentials !',
            }));
        }

        const user = userCheck.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(200).json(responseFormatter({
                error: true,
                message: 'Invalid credentials !',
            }));
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        return res.status(200).json(responseFormatter({
            error: false,
            message: 'Login successful',
            data: { token, user: { id: user.id, email: user.email } }
        }));
    } catch (error) {
        console.error("ERROR SIGNING IN:", error);
        return res.status(500).json(responseFormatter({
            error: true,
            message: 'Internal server error',
        }));
    }
}

module.exports = { signin, signup };
