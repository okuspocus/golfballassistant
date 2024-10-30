import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Configuración para la desencriptación
const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Clave de 32 bytes en hexadecimal
const IV_LENGTH = 16; // Longitud del IV para aes-256-cbc

// Ruta del archivo CSV cifrado
const csvFilePath = path.join(process.cwd(), 'data', 'users.csv');

// Función para desencriptar los datos
function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Leer y desencriptar el archivo CSV
fs.readFile(csvFilePath, 'utf-8', (err, data) => {
  if (err) {
    console.error('Error al leer el archivo:', err);
    return;
  }
  
  // Desencriptar cada línea y mostrar
  const lines = data.trim().split('\n');
  const decryptedLines = lines.map(line => decrypt(line));
  decryptedLines.forEach((decryptedLine, index) => {
    console.log(`Usuario ${index + 1}:`, decryptedLine);
  });
});

