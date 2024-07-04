const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

const SECRET_KEY = process.env.SECRET_KEY;
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

const auth = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                console.error('Token verification failed:', err);
                return res.redirect('/login');
            }
            req.user = user;
            next();
        });
    } else {
        return res.redirect('/login');
    }
};

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const user = { username, password };
    let users = [];
    try {
        const data = fs.readFileSync('users.json', 'utf-8');
        users = JSON.parse(data);
    } catch (error) {
        console.error('Error reading users.json:', error);
    }

    if (users.find(us => us.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    users.push(user);

    try {
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error writing to users.json file:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.redirect('/login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    let users = [];
    try {
        const data = fs.readFileSync('users.json', 'utf-8');
        users = JSON.parse(data);
    } catch (error) {
        console.error('Error reading users.json:', error);
    }

    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    console.log('Token set in cookie:', token);
    res.redirect('/user');
});

app.get('/user', auth, (req, res) => {
    let users = [];
    try {
        const data = fs.readFileSync('users.json', 'utf-8');
        users = JSON.parse(data);
    } catch (error) {
        console.error('Error reading users.json:', error);
    }
    const user = users.find(user => user.username === req.user.username);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.render('user', { user });
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});
