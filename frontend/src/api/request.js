import request from 'superagent';

import config from '../config';

const reqServer = async function(type, data = {}, endpoint) {
  const {
    attach,
    headers,
    ...rest
  } = data;

  const params = { ...rest
  };

  const req = request(type, config.apiHost + endpoint);

  Object.keys(params).forEach(key => params[key] === null && delete params[key]);

  req
    .set('Accept', 'application/json')
    .query({
      no_cache: new Date().getTime(),
    });

  if (attach) {
    const attachs = [].concat(attach);

    for (let i = 0; i < attachs.length; i += 1) {
      req.attach(attachs[i].name, attachs[i].file);
    }

    Object.keys(params).forEach(key => req.field(key, params[key]));
  } else if (type === 'GET') {
    req.query(params);
  } else {
    req.send(params);
  }

  const response = await req;
  console.log(response);
}


export const post = (endpoint, data) => reqServer('POST', data, endpoint)

export const put = (endpoint, data) => reqServer('PUT', data, endpoint)

export const get = (endpoint, data) => reqServer('GET', data, endpoint)

export const del = (endpoint, data) => reqServer('DELETE', data, endpoint)
