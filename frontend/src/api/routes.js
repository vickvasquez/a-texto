import {
  post, get, put, del,
} from './request';

class EndpointRecordings {
  add(data) {
    return post('/api/recordings', data);
  }

  update(id, data) {
    return put(`/api/recordings/${id}`, data);
  }

  remove(id, data) {
    return del(`/api/recordings/${id}`, data);
  }

  getAll() {
    return get('/api/recordings');
  }
}

export default new EndpointRecordings();
