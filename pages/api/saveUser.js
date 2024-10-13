import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { token } = req.query;

    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET);

      const { name, email } = decoded;

      // Define the path to the CSV file
      const csvFilePath = path.join(process.cwd(), 'data', 'users.csv');
      const newEntry = `${name},${email}\n`;

      // Append the new entry to the CSV file
      fs.appendFile(csvFilePath, newEntry, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error saving data' });
        }

        // Send a success response after saving data
        return res.status(200).json({ message: 'Email verified and data saved successfully' });
      });
    } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
