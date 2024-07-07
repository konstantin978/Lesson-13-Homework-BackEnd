require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { generateToken } = require('../middlewares');

const authRouter = express.Router();

const userList = path.join(__dirname, '..', 'model', 'users.json')
const uploads = path.join(__dirname, '..', 'public', 'uploads')

authRouter.post('/register', (req, res) => {
    const { username, email, password, photo } = req.body;
    let users = JSON.parse(fs.readFileSync(userList, 'utf-8'));

    if (username && email && password) {
        if (users.find(user => user.email === email)) {
            return res.status(409).json({ message: 'User already exists' })
        }

        let photoPath = null;
        if (photo) {
            const base64Data = photo.replace(/^data:image\/\w+;base64,/, '')
            const photoBuffer = Buffer.from(base64Data, 'base64')
            const photoFilename = `${Date.now()}.jpg`
            photoPath = path.join('uploads', photoFilename)
            const photoFilePath = path.join(uploads, photoFilename)
            fs.writeFileSync(photoFilePath, photoBuffer)
        }

        users.push({ username, email, password, photo: photoPath })
        fs.writeFileSync(userList, JSON.stringify(users, null, 2))

        return res.status(201).json({ message: 'User Successfully added' })
    }

    res.status(400).json({ message: 'Invalid input' });
});

authRouter.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!fs.existsSync(userList)) {
        return res.status(404).json({ message: 'User not found' });
    }

    const users = JSON.parse(fs.readFileSync(userList, 'utf-8'));
    const user = users.find(us => us.email === email);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const token = generateToken(user);
    res.status(200).json({ token });
});

module.exports = authRouter;
