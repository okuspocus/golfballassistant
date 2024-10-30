// pages/api/verify.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { token } = req.query;

    try {
      // Verificar el token y extraer la información del usuario
      const decoded = jwt.verify(token, JWT_SECRET);
      const { name, email } = decoded;

      // Guardar los datos en el archivo CSV llamando a /api/saveUser
      await fetch(`${process.env.FRONTEND_URL}/api/saveUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });

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

