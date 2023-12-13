
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');

dotenv.config();

const { registerUser, loginUser } = require('./dataquery');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'templates', 'main.html'));
});

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'templates', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'templates', 'register.html'));
});

app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'public', 'templates', 'dashboard.html'));
    } else {
        res.redirect('/');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
app.post('/register', (req, res) => {
    if (!req.body.email) {
        return res.status(400).send('Vui lòng cung cấp địa chỉ email.');
    }

    registerUser(req.body.email, req.body.username, req.body.password, (err) => {
        if (err) {
            if (err.message === 'Người dùng đã tồn tại') {
                return res.status(400).send('Người dùng đã tồn tại. Vui lòng chọn tên đăng nhập khác.');
            }
            return res.status(500).send(err.message);
        }
        res.redirect('/login');
    });
});


app.post('/login', (req, res) => {
    loginUser(req.body.username, req.body.password, (err, user) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        if (user) {
            req.session.user = user;
            res.redirect('/dashboard');
        } else {
            res.status(401).send('Tên đăng nhập hoặc mật khẩu không đúng!');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
