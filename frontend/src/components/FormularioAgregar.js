import React, { useState, useEffect } from 'react';

function FormularioAgregar({ pelicula, onClose, onRefresh }) {
    const [formData, setFormData] = useState({
        titulo: '',
        genero: '',
        descripcion: '',
        poster: ''
    });

    // Si estamos editando, cargamos los datos de la película
    useEffect(() => {
        if (pelicula) {
            setFormData({
                titulo: pelicula.titulo,
                genero: pelicula.genero,
                descripcion: pelicula.descripcion,
                poster: pelicula.poster
            });
        }
    }, [pelicula]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = pelicula 
                ? `http://localhost:4000/api/peliculas/${pelicula._id}`
                : 'http://localhost:4000/api/peliculas';
            const method = pelicula ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Error al guardar la película');
            }

            onRefresh();
            onClose();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar la película');
        }
    };

    return (
        <div className="formulario-modal">
            <div className="formulario-contenido">
                <h2>{pelicula ? 'Editar Película' : 'Agregar Película'}</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Título:</label>
                        <input
                            type="text"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Género:</label>
                        <input
                            type="text"
                            name="genero"
                            value={formData.genero}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Descripción:</label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Poster (URL):</label>
                        <input
                            type="text"
                            name="poster"
                            value={formData.poster}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit">Guardar</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </form>
            </div>
        </div>
    );
}

export default FormularioAgregar;