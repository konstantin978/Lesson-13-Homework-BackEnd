require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { generateToken } = require('../middlewares')

const authRouter = express.Router();

const userList = path.join(__dirname, '../model', 'users.json');

authRouter.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const users = JSON.parse(fs.readFileSync(userList));

    if (username && email && password) {
        if (users.find(user => user.email === email)) {
            return res.status(409).json({ message: 'User already exists' });
        }
        users.push({ username, email, password });
        fs.writeFileSync(userList, JSON.stringify(users, null, 2));
    }
    res.status(201).json({ message: 'User Succesfully added' });
});


authRouter.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = JSON.parse(fs.readFileSync(userList));

    const user = users.find(us => us.email === email);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (user.email !== email && user.password !== password) {
        return res.status(401).json({ message: 'Invalid Credentials' });
    }
    const token = generateToken(user)
    res.status(200).json({ token })
});

module.exports = authRouter;