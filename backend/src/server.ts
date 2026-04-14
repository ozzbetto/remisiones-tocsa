import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from './app.js';
import { connectDB } from './config/db.js';

console.log('📝 Configuración de InvGate:', {
  url: process.env.INVGATE_API_URL,
  clientId: process.env.INVGATE_CLIENT_ID ? 'Configurado ✅' : 'Faltante ❌',
  clientSecret: process.env.INVGATE_CLIENT_SECRET ? 'Configurado ✅' : 'Faltante ❌'
});

const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Start Server
app.listen(PORT as number, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
});
