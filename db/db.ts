import mongoose from 'mongoose';

export async function initDB() {
  const DB = process.env.DB;
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
