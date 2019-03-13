const apiHost = window.apiHost || process.env.API_HOST || 'http://localhost:3000';

const config = {
  apiHost,
  title: 'A texto',
  port: process.env.PORT || 4000,
  env: window.env || process.env.NODE_ENV,
};

export default config;
