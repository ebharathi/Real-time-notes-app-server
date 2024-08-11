const jwt = require('jsonwebtoken');
const responseFormatter = require('../utils/FormatResponse'); // Adjust the path

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json(responseFormatter({ error: true, message: 'No token, authorization denied' }));
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json(responseFormatter({ error: true, message: 'Token is not valid' }));
    }
}

module.exports = authMiddleware;
