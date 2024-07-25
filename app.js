require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');
const loginRoutes = require('./routes/User/login');
const registerRoutes = require('./routes/User/register');
const userRoutes = require('./routes/User/users');
const deleteUserRoutes = require('./routes/User/deleteUser');
var cors = require('cors');


const app = express();

mongoose.connect('mongodb://localhost/chartsign-login', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.set('view engine', 'ejs');

const corsOptions = {
    origin: '*', // Replace '*' with specific origin(s) as needed, e.g., 'http://example.com'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use(loginRoutes);
app.use(registerRoutes);
app.use(userRoutes);
app.use(deleteUserRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});