import request from 'superagent';
import { extractFiles } from 'extract-files';

import config from '../config';

function handleError(error) {
  const { body } = error;
  const { message, status } = body;

  return {
    errors: body.errors,
    message,
    status,
  };
}

const reqServer = async function reqServer(type, data = {}, endpoint) {
  const {
    headers,
    ...rest
  } = data;

  const files = extractFiles(data);
  const params = { ...rest };
  const req = request(type, config.apiHost + endpoint);

  Object.keys(params).forEach(key => params[key] === null && delete params[key]);

  req
    .set('Accept', 'application/json')
    .query({
      no_cache: new Date().getTime(),
    });

  if (files) {
    const attachs = [].concat(files);

    for (let i = 0; i < attachs.length; i += 1) {
      req.attach(attachs[i].name, attachs[i].file);
    }

    Object.keys(params).forEach(key => req.field(key, params[key]));
  } else if (type === 'GET') {
    req.query(params);
  } else {
    req.send(params);
  }

  try {
    const { body } = await req;
    return body;
  } catch (err) {
    const resp = JSON.parse(JSON.stringify(err));
    const error = handleError(resp.response);
    throw error;
  }
};


export const post = (endpoint, data) => reqServer('POST', data, endpoint);

export const put = (endpoint, data) => reqServer('PUT', data, endpoint);

export const get = (endpoint, data) => reqServer('GET', data, endpoint);

export const del = (endpoint, data) => reqServer('DELETE', data, endpoint);
