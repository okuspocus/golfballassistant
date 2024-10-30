// decryptUsers.mjs
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Debe ser de 32 bytes (64 caracteres hexadecimales)
const IV_LENGTH = 16; // Longitud del IV para aes-256-cbc

// Ruta del archivo CSV cifrado
const csvFilePath = path.join(process.cwd(), 'data', 'users.csv');

// Función para desencriptar los datos
function decrypt(text) {
  // Dividimos IV y texto encriptado
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex'); // Primer parte es el IV
  const encryptedText = Buffer.from(textParts.join(':'), 'hex'); // Lo que queda es el texto cifrado

  // Desencriptamos con el IV y la clave
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString(); // Devolver en texto claro
}

// Leer y desencriptar el archivo CSV
fs.readFile(csvFilePath, 'utf-8', (err, data) => {
  if (err) {
    console.error('Error al leer el archivo:', err);
    return;
  }
  
  const lines = data.trim().split('\n');
  const decryptedLines = lines.map(line => {
    try {
      return decrypt(line);
    } catch (err) {
      console.error('Error al desencriptar línea:', line, err.message);
      return null;
    }
  });

  // Imprimir resultados desencriptados
  decryptedLines.forEach((decryptedLine, index) => {
    if (decryptedLine) {
      console.log(`Usuario ${index + 1}:`, decryptedLine);
    }
  });
});

