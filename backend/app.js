const express = require('express');
const morgan = require('morgan');
const path = require('path');

const pageRoutes = require('./routes/pagesRoutes');

const connectDB = require('./config/db');

const app = express();

if (process.env.NODE_ENV === 'dev' ) {
    app.use(morgan('dev'));
} else {
    app.use(morgan('common'));
}

connectDB();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use('/api/page', pageRoutes);


// static route for developpement access to build repository
const __dir = path.resolve();

// test the build
// app.use(express.static(path.join(__dir, '/frontend/build')));
// app.get('*', (req, res) => res.sendFile(path.resolve(__dir, 'frontend', 'build', 'index.html')))


//app.get('/', (req, res) => res.send(`API is running...`));

if (['production'].includes(process.env.NODE_ENV)) {
    app.use(express.static(path.join(__dir, '/frontend/public')));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dir, 'frontend', 'public', 'build', 'index.html')))
} else {
    app.get('/', (req, res) => res.send(`API is running...`));
}

module.exports = app;