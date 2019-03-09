import mongoose from 'mongoose';

import config from '../config/config';

const { host, port, db } = config.mongodb;
const env = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test';
let client = null;

(async() => {
  try {
    client = await mongoose.connect(`mongodb://${host}:${port}/${db}`, { useNewUrlParser: true });
    mongoose.set('debug', env)
  } catch(err) {
    console.log('Error connection to databases', err);
  }
})()

module.exports = client;