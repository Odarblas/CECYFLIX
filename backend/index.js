const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const peliculasRouter = require('./routes/peliculas');
require('dotenv').config();

const app = express();
const PORT = 4000;

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 segundos
  socketTimeoutMS: 45000, // 45 segundos
  connectTimeoutMS: 30000, // 30 segundos
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => {
  console.error('❌ Error de conexión a MongoDB:', err.message);
  process.exit(1); // Sale del proceso si no puede conectar
});

// Rutas
app.use('/api/peliculas', peliculasRouter);

// Ruta de recomendaciones IA
app.post('/api/recomendaciones', async (req, res) => {
  const { prompt } = req.body;
  
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 200
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'CECYFLIX'
        }
      }
    );

    const recomendacion = response.data.choices[0].message.content;
    res.json({ recomendacion });
    
  } catch (error) {
    console.error('Error en la API de OpenRouter:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Error al obtener recomendación',
      details: error.response?.data || error.message
    });
  }
});

// Iniciar servidor
app.get('/', (req, res) => {
  res.send('🎬 Bienvenido al backend de CECYFLIX');
});
