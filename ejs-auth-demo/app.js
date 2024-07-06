const express = require('express');
const fs = require('fs');
const path = require('path');
const authRouter = require('./routers/auth')
const { validateToken } = require('./middlewares');

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // static files import
app.use(express.urlencoded({ extended: true })) //for including all objects(in users.json)

app.set('view engine', 'ejs'); // for import ejs files

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/users', validateToken, (req, res) => {
    const user = req.user.username
    res.render('users', {user: user});
})

app.use('/api', authRouter)

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});
