// const jwt = require('jsonwebtoken');
// const User = require('../models/user');

// const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (token == null) {
//         return res.status(401).json({ message: 'No token provided' });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) {
//             console.error('JWT Verification Error:', err);
//             return res.status(403).json({ message: 'Invalid token' });
//         }
//         req.user = user;
//         next();
//     });
// };

// const authenticateAdminToken = async(req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (token == null) {
//         return res.status(401).json({ message: 'No token provided' });
//     }
//     jwt.verify(token, process.env.JWT_SECRET, async(err, user) => {
//         if (err) {
//             console.error('JWT Verification Error:', err);
//             return res.status(403).json({ message: 'Invalid token' });
//         }
//         const userFound = await User.findById(user.id);
//         if (!userFound.isAdmin) {
//             return res.status(403).json({ message: 'You are not an admin' });
//         }
//         req.user = user;
//         next();
//     });
// };

// module.exports = {
//     authenticateToken, authenticateAdminToken
// };










const jwt = require('jsonwebtoken');
const User = require('../models/user');
 
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
 
    if (token == null) {
        return res.status(401).json({ message: 'No token provided' });
    }
 
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};
 
const authenticateAdminToken = async(req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, process.env.JWT_SECRET, async(err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        const userFound = await User.findById(user.id);
        if (!userFound.isAdmin) {
            return res.status(403).json({ message: 'You are not an admin' });
        }
        req.user = user;
        next();
    });
};
 
module.exports = {
    authenticateToken, authenticateAdminToken
}