import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import spotifyRoutes from './routes/spotify';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000',
  'https://playnote-frontend.vercel.app',
  'https://spotify-sheet-player-v2.vercel.app',
  'https://spotify-player-v2.vercel.app',
  process.env.FRONTEND_URL
].filter((origin): origin is string => Boolean(origin));

app.use(cors({
  origin: (origin, callback) => {
    // 開発環境では全てのオリジンを許可
    if (process.env.NODE_ENV === 'development') {
      callback(null, true);
      return;
    }
    
    // 本番環境では許可されたオリジンのみ
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'Content-Type']
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/spotify', spotifyRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});