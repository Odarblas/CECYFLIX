import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [peliculas, setPeliculas] = useState([]);
  const [peliculasFiltradas, setPeliculasFiltradas] = useState([]);
  const [recomendacionIA, setRecomendacionIA] = useState('');
  const [peliculasRecomendadas, setPeliculasRecomendadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar películas desde MongoDB
  useEffect(() => {
    const fetchPeliculas = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/peliculas');
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('La respuesta no es un array de películas');
        }
        
        setPeliculas(data);
        setPeliculasFiltradas(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar películas:', err);
        setError('Error al cargar las películas. Intenta recargar la página.');
      } finally {
        setLoading(false);
      }
    };

    fetchPeliculas();
  }, []);

  const handleBuscarTexto = () => {
    if (!peliculas.length) return;
    
    const texto = input.toLowerCase();
    const filtradas = peliculas.filter((peli) =>
      (peli.titulo && peli.titulo.toLowerCase().includes(texto)) ||
      (peli.genero && peli.genero.toLowerCase().includes(texto))
    );
    
    setPeliculasFiltradas(filtradas);
    setPeliculasRecomendadas([]);
    setRecomendacionIA('');
  };

  const handleBuscarDescripcion = async () => {
    if (!peliculas.length) return;
    
    setRecomendacionIA('Pensando...');
    setPeliculasRecomendadas([]);
    setPeliculasFiltradas([]);
    
    try {
      const response = await fetch('http://localhost:4000/api/recomendaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Tengo una base de datos con estas películas: ${peliculas
            .map(p => p.titulo).join(', ')}.
            Quiero que me digas solo los títulos de las películas que coincidan con esta
            descripción: "${input}".
            Devuélveme únicamente los títulos separados por comas.`
        }),
      });
      
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      
      const data = await response.json();
      const textoIA = data.recomendacion.toLowerCase();
      setRecomendacionIA(data.recomendacion);
      
      const coincidencias = peliculas.filter((peli) =>
        textoIA.includes(peli.titulo.toLowerCase())
      );
      
      setPeliculasRecomendadas(coincidencias);
    } catch (err) {
      console.error('Error al obtener recomendación IA:', err);
      setRecomendacionIA('❌ Error al obtener recomendación IA.');
    }
  };

  if (loading) {
    return <div className="App">Cargando películas...</div>;
  }

  return (
    <div className="App">
      <h1 className="titulo">CECYFLIX</h1>
      <div className="buscador">
        <input
          type="text"
          placeholder="¿Qué te gustaría ver hoy?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <button onClick={handleBuscarTexto}>Buscar</button>
        <button onClick={handleBuscarDescripcion} className="btn-ia">
          Buscar por descripción
        </button>
      </div>

      {recomendacionIA && (
        <div className="bloque-recomendaciones">
          <h2>✨ Recomendación IA</h2>
          <p>{recomendacionIA}</p>
        </div>
      )}

      {peliculasRecomendadas.length > 0 && (
        <div className="galeria">
          <h2>🎞 Películas recomendadas por IA</h2>
          <div className="grid">
            {peliculasRecomendadas.map((peli) => (
              <div className="tarjeta" key={peli._id || peli.id}>
                <img src={peli.poster} alt={peli.titulo} />
                <div className="info">
                  <h3>{peli.titulo}</h3>
                  <p>{peli.descripcion}</p>
                  <span>{peli.genero}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {peliculasFiltradas.length > 0 && (
        <div className="galeria">
          <h2>🎬 Todas las películas</h2>
          <div className="grid">
            {peliculasFiltradas.map((peli) => (
              <div className="tarjeta" key={peli._id || peli.id}>
                <img src={peli.poster} alt={peli.titulo} />
                <div className="info">
                  <h3>{peli.titulo}</h3>
                  <p>{peli.descripcion}</p>
                  <span>{peli.genero}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!peliculasFiltradas.length && !peliculasRecomendadas.length && !loading && (
        <p>No se encontraron películas. Intenta con otro término de búsqueda.</p>
      )}
    </div>
  );
}

export default App;