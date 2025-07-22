const mongoose = require('mongoose');

const peliculaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    genero: String,
    descripcion: String,
    poster: String
});
// Exportamos el modelo para usarlo en otras partes del backend
module.exports = mongoose.model('Pelicula', peliculaSchema);