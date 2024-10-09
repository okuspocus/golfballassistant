const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Definir el esquema y el modelo
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  acceptsPromos: Boolean,
});

const User = mongoose.model('User', userSchema);

// Ruta para manejar la solicitud POST
app.post('/api/users', async (req, res) => {
  const { name, email, acceptsPromos } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Nombre y email son requeridos' });
  }

  try {
    const user = new User({ name, email, acceptsPromos });
    await user.save();
    res.status(201).json({ message: 'Usuario guardado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el usuario' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

