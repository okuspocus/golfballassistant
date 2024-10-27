import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { token } = req.query;

    try {
      // Verificar el token JWT
      const decoded = jwt.verify(token, JWT_SECRET);
      const { name, email } = decoded;

      // Definir la ruta del archivo CSV
      const csvFilePath = path.join(process.cwd(), 'data', 'users.csv');
      const newEntry = `${name},${email}\n`;

      // Guardar la entrada en el archivo CSV usando fs.promises.appendFile
      await fs.appendFile(csvFilePath, newEntry);

      // Redirigir a la página de verificación con los datos en los parámetros de la URL
      res.writeHead(302, {
        Location: `/verified?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`,
      });
      res.end(); // Cerrar la respuesta
    } catch (err) {
      console.error('Error:', err.message);
      // Enviar un error si el token es inválido o si ocurre un problema de escritura en el archivo
      res.status(400).json({ message: 'Invalid or expired token' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

