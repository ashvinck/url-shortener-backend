import { ObjectId } from 'mongodb';
import { client } from '../index.js';

export async function registerUser(data) {
  try {
    const result = await client
      .db('URLshort')
      .collection('UserData')
      .insertOne(data);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function getUserEmailFromDB(email) {
  try {
    const result = await client
      .db('URLshort')
      .collection('UserData')
      .findOne({ email: email });
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function getUserFromDB(email) {
  try {
    const result = await client
      .db('URLshort')
      .collection('UserData')
      .findOne({ email: email });
    return result;
  } catch (err) {
    console.error(err);
  }
}
export async function updateVerificationStatus(email) {
  try {
    const result = await client
      .db('URLshort')
      .collection('UserData')
      .updateOne({ email: email }, { $set: { accountVerified: true } });
    return result;
  } catch (err) {
    console.error(err);
  }
}
export async function getUserIDFromDB(_id) {
  try {
    const result = await client
      .db('URLshort')
      .collection('UserData')
      .findOne({ _id: new ObjectId(_id) });
    return result;
  } catch (err) {
    console.error(err);
  }
}
export async function resetPasswordById({ userId, password: hashedPassword }) {
  try {
    const result = await client
      .db('URLshort')
      .collection('UserData')
      .updateOne(
        { _id: new ObjectId(userId) },
        { $set: { password: hashedPassword } }
      );
    return result;
  } catch (error) {
    console.error(error);
  }
}
