import createError from 'http-errors';
import { nanoid } from 'nanoid/async';
import dayjs from 'dayjs';
import { BackendAPI } from '../config/api.js';
import {
  createURL,
  getAllURL,
  getURLFromDB,
  getshortURLFromDB,
  updateView,
} from '../services/url.services.js';

// @route GET /url/
// @desc - To list all the urls which were created by user and stored in the DB
export const getAllURLs = async (request, response, next) => {
  try {
    const result = await getAllURL();
    response.send(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc - (nanoid creates a unique 10 character string for each particular url given
// if url already exists then returns the shortened url
//or else creates a new one)
// @route POST /url/
export const createShortUrl = async (request, response, next) => {
  try {
    const { url } = request.body;
    if (!url) throw createError('Please provide a valid URL');

    const urlExists = await getURLFromDB(url);
    if (urlExists) {
      const short_url = `${BackendAPI}/url/${urlExists.shortURL}`;
      response.send({ message: 'URL already exists.' });
    } else {
      const shortURL = await nanoid(8);
      const date = dayjs().toString();
      await createURL(url, shortURL, date);
      response.send({ message: 'URL has been shortened successfully' });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Takes shortURL from generated URL checks in DB if it exists
// Matches the original URL against the current URL
// Increments the view count by 1 when clicked on the link to
// Redirects the user to original URL when clicked on the link
// @route POST /url/:shortURL
export const redirectUrl = async (request, response, next) => {
  try {
    const { shortURL } = request.params;
    const results = await getshortURLFromDB(shortURL);
    if (!results) throw createError.NotFound('Shortened URL does not exist');

    await updateView(shortURL);
    response.redirect(results.url);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
