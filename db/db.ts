import mongoose from 'mongoose';
const DB = process.env.DB;

export async function initDB() {
  if (DB) {
    try {
      await mongoose.connect(DB);
    } catch (e) {
      /* handle error */
      console.error('db::Error failed to connect mongoDB', e);
      throw e;
    }
  } else {
    throw 'MongoDB not set';
  }
}
