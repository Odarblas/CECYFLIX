import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPeliculas = async () => {
      try {
        console.log('Iniciando fetch a /api/peliculas'); // Log 1
        const response = await fetch('https://recomendaciones-backend-jkjm.onrender.com');
        
        console.log('Respuesta recibida', response); // Log 2
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        console.log('Datos recibidos:', data); // Log 3
        
        setPeliculas(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching películas:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPeliculas();
  }, []);

  if (loading) return <div className="loading">Cargando películas...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="App">
      <h1>Catálogo de Películas</h1>
      
      {peliculas.length === 0 ? (
        <p>No hay películas disponibles</p>
      ) : (
        <div className="movie-grid">
          {peliculas.map((peli) => (
            <div key={peli._id} className="movie-card">
              <img 
                src={peli.poster || 'https://via.placeholder.com/300x450'} 
                alt={peli.titulo}
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://via.placeholder.com/300x450';
                }}
              />
              <h3>{peli.titulo}</h3>
              <p>{peli.genero}</p>
              <p className="description">{peli.descripcion?.substring(0, 100)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
