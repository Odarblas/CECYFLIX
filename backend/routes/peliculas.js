const express = require('express');
const router = express.Router();
const Pelicula = require('../models/Pelicula');

// Obtener todas las películas
router.get('/', async (req, res) => {
  try {
    const peliculas = await Pelicula.find({}); // {} para obtener todos los documentos
    console.log('Películas encontradas:', peliculas.length); // Log para depuración
    res.json(peliculas);
  } catch (error) {
    console.error('Error al buscar películas:', error);
    res.status(500).json({ error: error.message });
  }
});

// Agregar una nueva película
router.post('/', async (req, res) => {
    try {
        const nuevaPelicula = new Pelicula(req.body);
        const peliculaGuardada = await nuevaPelicula.save();
        res.status(201).json(peliculaGuardada);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// Actualizar una película
router.put('/:id', async (req, res) => {
    try {
        const peliculaActualizada = await Pelicula.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(peliculaActualizada);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

module.exports = router;