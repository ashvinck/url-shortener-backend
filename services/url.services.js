import { client } from '../index.js';

export async function getURLFromDB(url) {
  try {
    const result = await client
      .db('URLshort')
      .collection('URLs')
      .findOne({ url: url });
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function createURL(url, shortURL, date) {
  try {
    const result = await client
      .db('URLshort')
      .collection('URLs')
      .insertOne({ url: url, shortURL: shortURL, views: 0, createdOn: date });
    return result;
  } catch (error) {
    console.error(error);
  }
}
export async function getshortURLFromDB(shortURL) {
  try {
    const result = await client
      .db('URLshort')
      .collection('URLs')
      .findOne({ shortURL: shortURL });
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function updateView(shortURL) {
  try {
    const result = await client
      .db('URLshort')
      .collection('URLs')
      .updateOne({ shortURL: shortURL }, { $inc: { views: 1 } });
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function getAllURL() {
  try {
    const result = await client
      .db('URLshort')
      .collection('URLs')
      .find({})
      .toArray();
    return result;
  } catch (error) {
    console.error(error);
  }
}
