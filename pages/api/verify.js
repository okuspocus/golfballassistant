// pages/api/verify.js
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { token } = req.query;

    try {
      // Verificar token y extraer información de usuario
      const decoded = jwt.verify(token, JWT_SECRET);
      const { name, email } = decoded;

      // Añadir al CSV
      const csvFilePath = path.join(process.cwd(), 'data', 'users.csv');
      const newEntry = `${name},${email}\n`;
      await fs.appendFile(csvFilePath, newEntry);

      // Redirigir a la página de verificación con el token en la URL
      res.writeHead(302, {
        Location: `/verified?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&token=${token}`,
      });
      res.end();
    } catch (err) {
      console.error('Error:', err.message);
      res.status(400).json({ message: 'Invalid or expired token' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}


