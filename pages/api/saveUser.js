// pages/api/saveUser.js (o similar)
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

  const { name, email } = req.body;

  // Cifrar la información
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(`${name},${email}`);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  // Guardar en formato IV:encryptedText
  const encryptedData = `${iv.toString('hex')}:${encrypted.toString('hex')}\n`;
  
  fs.appendFile(csvFilePath, encryptedData, (err) => {
    if (err) {
      console.error('Error al guardar los datos:', err);
      return res.status(500).json({ message: 'Error al guardar los datos' });
    }
    return res.status(200).json({ message: 'Datos guardados exitosamente' });
  });
}
