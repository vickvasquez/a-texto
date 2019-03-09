import mongoose from 'mongoose';

import config from '../config/config';
const { host, port, db } = config.mongodb;

try {
  mongoose.connect(`mongodb://${host}:${port}/${db}`);
  console.log('Connected to db');
} catch(err) {
  console.log('Error connection to databases', err);
}

module.exports = mongoose.connection;