// pages/api/saveUser.js 
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

// Ruta del archivo CSV
const csvFilePath = path.join(process.cwd(), 'data', 'users.csv');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  try {
    const { name, email } = req.body;

    // Verificación de datos de entrada
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Cifrar la información
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(`${name},${email}`);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    // Guardar en formato IV:encryptedText
    const encryptedData = `${iv.toString('hex')}:${encrypted.toString('hex')}\n`;
    
    // Escribir en el archivo y enviar la respuesta
    fs.appendFile(csvFilePath, encryptedData, (err) => {
      if (err) {
        console.error('Error al guardar los datos:', err);
        return res.status(500).json({ message: 'Error al guardar los datos' });
      }
      // Respuesta exitosa
      return res.status(200).json({ message: 'Datos guardados exitosamente' });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: 'Unexpected error occurred' });
  }
}

