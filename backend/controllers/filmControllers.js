const asyncHandler = require('express-async-handler');
const Film = require('../models/filmModel');

// @desc    create a film
// @route   POST /api/film
// @access  Private
const createFilm = asyncHandler(async(req,res) =>{
    
    const filmToCreate = req.body;

    const film = await Film.create(filmToCreate);

    if(film) {
        res.status(200).json({message: 'film created', value: film});
    } else {
        res.status(404).json({
            message: `film not created`,
            value: null
        });
    }
});

// @desc    get all films
// @route   GET /api/film?location=
// @access  Public
const getAllFilmsContent = asyncHandler(async(req,res) =>{
    
    const location = req.query.location ? { location: req.query.location } : {};

    let films = await Film.find({ ...location })
                            .sort({'date': 1});

    if(films) {
        res.status(200).json({message: 'get all films', value: films});
    } else {
        res.status(404).json({
            message: `Error geting all films. location: ${location}`,
            value: null
        });
    }
});

// @desc    get content for a specific film
// @route   GET /api/film/:id
// @access  Public
const getFilmContent = asyncHandler(async(req,res) =>{
    
    const filmId = req.params.id
    const film = await Film.findById(filmId);

    if(film) {
        res.status(200).json({message: 'get film', value: film});
    } else {
        res.status(404).json({
            message: `film content not found. film id requested : ${filmId}`,
            value: null
        });
    }
});

// @desc    update content for a specific film
// @route   PUT /api/film/:id
// @access  Private
const updateFilmContent = asyncHandler(async(req,res) =>{
    
    const filmId = req.params.id
    const updatedFilm = req.body

    const film = await Film.findById(filmId);

    if(film) {
        film.location = updatedFilm.location;
        film.title = updatedFilm.title;
        film.url = updatedFilm.url;
        film.real = updatedFilm.real;
        film.summury = updatedFilm.summury;
        film.infosGenerales = updatedFilm.infosGenerales;
        film.actions = updatedFilm.actions;
        await film.save();

        res.status(200).json({message: 'film updated', value: film});
    } else {
        res.status(404).json({
            message: `film content not found. film id requested : ${filmId}`,
            value: null
        });
    }
});

// @desc    delete a film
// @route   DELETE /api/film/:id
// @access  Private
const deleteFilmContent = asyncHandler(async(req,res) =>{
    
    const filmId = req.params.id

    const film = await Film.deleteOne({_id: filmId});

    if(film) {
        res.status(200).json({message: 'film deleted', value: null});
    } else {
        res.status(404).json({
            message: `Error deleting film : ${filmId}`,
            value: null
        });
    }
});

module.exports = { getFilmContent, updateFilmContent, createFilm, getAllFilmsContent, deleteFilmContent };