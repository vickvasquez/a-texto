let db = process.env.NAME_DB || 'atexto';
const env = process.env.NODE_ENV || 'development';

if (env !== 'production') {
  db = env === 'test' ? `${db}_test` : `${db}_dev`;
}

const config = {
  mongodb: {
    host: process.env.HOST_DB || 'localhost',
    port: process.env.PORT_DB || '27017',
    db,
  }
}

export default config;