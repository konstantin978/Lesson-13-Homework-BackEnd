const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const SECRET_KEY = process.env.SECRET_KEY;
const userList = path.join(__dirname, './model', 'users.json');

const generateToken = (user) => {
    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: 5 });
    return token
}

const validateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        console.log('no token');
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, data) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' })
        }

        const users = JSON.parse(fs.readFileSync(userList))
        const user = users.find(u => u.email === data.email)
        if (user) {
            req.user = user
            next()
        }
    })
}

module.exports = { generateToken, validateToken }