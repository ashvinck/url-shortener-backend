import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
import urlShortenerRouter from './routes/url-shortener.routes.js';
import { createConnection } from './config/dbConn.js';

const app = express();
app.use(cors());
app.use(express.json());

export const client = await createConnection();

// routes
app.use('/auth', authRouter);
app.use('/url', urlShortenerRouter);

app.get('/', function (request, response) {
  response.send('🙋‍♂️, Welcome to URL Shortener App');
});

// Error handling
app.use((error, request, response, next) => {
  response.status(error.status || 500);
  response.send({
    error: {
      status: error.status || 500,
      message: error.message,
    },
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨ `));
