import express from 'express';
import {
  createShortUrl,
  getAllURLs,
  redirectUrl,
} from '../controller/url-shortener.controller.js';
import { authValidation } from '../middleware/authValidation.js';

const router = express.Router();

router.post('/createURL', authValidation, createShortUrl);
router.get('/:shortURL', redirectUrl);
router.get('/', authValidation, getAllURLs);

export default router;
