const express = require('express');
const morgan = require('morgan');
const path = require('path');

const pageRoutes = require('./routes/pagesRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes');
const articleRoutes = require('./routes/articleRoutes');
const filmRoutes = require('./routes/filmRoutes');
const emailRoutes = require('./routes/emailRoutes');
const logsRoutes = require('./routes/logsRoutes');
const navRoutes = require('./routes/navRoutes');
const footerRoutes = require('./routes/footerRoutes');
const seoRoutes = require('./routes/seoRoutes');
const fontRoutes = require('./routes/fontRoutes');

const config = require('../config/config.json');

const { connectDB } = require('./config/db');
const { logARequest } = require('./controllers/logControllers');

const app = express();

if (config.NODE_ENV === 'dev' ) {
    app.use(morgan('dev'));
}

connectDB();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

// logs stored in database
// https://expressjs.com/en/5x/api.html#req
app.use((req, res, next) => {
    const url = req.url;
    const splitPage = url.split(/page\//i);
    const splitFilm = url.split(/film\//i);
    const splitArticle = url.split(/article\//i);
    if (splitPage.length > 1) {
        logARequest('page', `_page/${splitPage[1]}`);
    }
    if (splitFilm.length > 1) {
        logARequest('film', `_film/${splitFilm[1]}`);
    }
    if (splitArticle.length > 1) {
        logARequest('article', `_article/${splitArticle[1]}`);
    }
    next();
})

app.use('/api/users', userRoutes);
app.use('/api/page', pageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/article', articleRoutes);
app.use('/api/film', filmRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/statistics', logsRoutes);
app.use('/api/nav', navRoutes);
app.use('/api/footer', footerRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/font', fontRoutes);


// static route for developpement access to build repository
const __dir = path.resolve();
app.use('/uploads', express.static(path.join(__dir, '/uploads')));

// test the build
// app.use(express.static(path.join(__dir, '/frontend/build')));
// app.get('*', (req, res) => res.sendFile(path.resolve(__dir, 'frontend', 'build', 'index.html')))


app.get('/', (req, res) => res.send(`API is running...`));

// if (['production'].includes(config.NODE_ENV)) {
//     app.use(express.static(path.join(__dir, '/frontend/public')));
//     app.get('*', (req, res) => res.sendFile(path.resolve(__dir, 'frontend', 'public', 'build', 'index.html')))
// } else {
//     app.get('/', (req, res) => res.send(`API is running...`));
// }

module.exports = app;