const asyncHandler = require('express-async-handler');
const Film = require('../models/filmModel');

// @desc    create a film
// @route   POST /api/film
// @access  Private
const createFilm = asyncHandler(async(req,res) =>{
    
    const filmToCreate = req.body;

    Film.create(filmToCreate)
        .then((film) => {
            if(film) {
                res.status(200).json({message: 'film created', value: film});
            } else {
                res.status(404).json({
                    message: `film not created`,
                    value: null
                });
            }
        })
        .catch((error) => res.status(500).json({message: `Error creating film in database: ${error}`}));

});

// @desc    get all films
// @route   GET /api/film?location=
// @access  Public
const getAllFilmsContent = asyncHandler(async(req,res) =>{
    
    const location = req.query.location ? { location: req.query.location } : {};

    Film.find({ ...location }).sort({'date': 1})
        .then((films) => {
            if(films) {
                res.status(200).json({message: 'get all films', value: films});
            } else {
                res.status(404).json({
                    message: `Error geting all films. location: ${location}`,
                    value: null
                });
            }
        })
        .catch((error) => res.status(500).json({message: `Error finding films in database: ${error}`}));

});

// @desc    get content for a specific film
// @route   GET /api/film/:id
// @access  Public
const getFilmContent = asyncHandler(async(req,res) =>{
    
    const filmId = req.params.id
    Film.findById(filmId)
        .then((film) => {
            if(film) {
                res.status(200).json({message: 'get film', value: film});
            } else {
                res.status(404).json({
                    message: `film content not found. film id requested : ${filmId}`,
                    value: null
                });
            }
        })
        .catch((error) => res.status(500).json({message: `Error finding film in database: ${error}`}));

});

// @desc    update content for a specific film
// @route   PUT /api/film/:id
// @access  Private
const updateFilmContent = asyncHandler(async(req,res) =>{
    
    const filmId = req.params.id
    const updatedFilm = req.body

    Film.findById(filmId)
        .then((film) => {
            if(film) {
                film.location = updatedFilm.location;
                film.title = updatedFilm.title;
                film.url = updatedFilm.url;
                film.real = updatedFilm.real;
                film.summury = updatedFilm.summury;
                film.infosGenerales = updatedFilm.infosGenerales;
                film.actions = updatedFilm.actions;
                film.book = updatedFilm.book;
                film.bookingAvailable = updatedFilm.bookingAvailable;
                film.justification = updatedFilm.justification;
                film.save()
                    .then(() => res.status(200).json({message: 'film updated', value: film}))
                    .catch((error) => res.status(500).json({message: `Error saving film in database: ${error}`}));
            } else {
                res.status(404).json({
                    message: `film content not found. film id requested : ${filmId}`,
                    value: null
                });
            }
        })
        .catch((error) => res.status(500).json({message: `Error finding film in database: ${error}`}));

});

// @desc    delete a film
// @route   DELETE /api/film/:id
// @access  Private
const deleteFilmContent = asyncHandler(async(req,res) =>{
    
    const filmId = req.params.id

    Film.deleteOne({_id: filmId})
        .then((film) => {
            if(film) {
                res.status(200).json({message: 'film deleted', value: null});
            } else {
                res.status(404).json({
                    message: `Error deleting film : ${filmId}`,
                    value: null
                });
            }
        })
        .catch((error) => res.status(500).json({message: `Error deleting film in database: ${error}`}));

});

module.exports = { getFilmContent, updateFilmContent, createFilm, getAllFilmsContent, deleteFilmContent };