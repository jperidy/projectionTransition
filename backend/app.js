const express = require('express');
const morgan = require('morgan');
const path = require('path');

const pageRoutes = require('./routes/pagesRoutes');
const pageNewRoutes = require('./routes/pagesNewRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes');
const articleRoutes = require('./routes/articleRoutes');

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

app.use('/api/users', userRoutes);
app.use('/api/page', pageRoutes);
app.use('/api/pageNew', pageNewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/article', articleRoutes);


// static route for developpement access to build repository
const __dir = path.resolve();
app.use('/uploads', express.static(path.join(__dir, '/uploads')));

// test the build
// app.use(express.static(path.join(__dir, '/frontend/build')));
// app.get('*', (req, res) => res.sendFile(path.resolve(__dir, 'frontend', 'build', 'index.html')))


app.get('/', (req, res) => res.send(`API is running...`));

// if (['production'].includes(process.env.NODE_ENV)) {
//     app.use(express.static(path.join(__dir, '/frontend/public')));
//     app.get('*', (req, res) => res.sendFile(path.resolve(__dir, 'frontend', 'public', 'build', 'index.html')))
// } else {
//     app.get('/', (req, res) => res.send(`API is running...`));
// }

module.exports = app;