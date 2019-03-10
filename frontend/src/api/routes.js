import { post, get, put, del } from './request';

class EndpointRecordings {
  async add(data) {
    return await post('/api/recordings', data);
  }
  async update(data) {
    const { id } = date
    return await put(`/api/recordings/${id}`, data);
  }
  async remove(data) {
    const { id } = date
    return await del(`/api/recordings/${id}`, data);
  }
  async getAll() {
    return await get('/api/recordings');
  }
}

export default new EndpointRecordings();