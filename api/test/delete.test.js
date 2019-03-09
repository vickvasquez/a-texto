import chai from 'chai';
import chaiHttp from 'chai-http';

import cleanDB from '../utils';
const server = require('../server');

chai.use(chaiHttp);
const { expect, request } = chai;

describe('Delete', () => {
  beforeEach(async () => {
    await cleanDB()
  })

  it('should return deleted 0 when not exist recording', async () => {
    const res = await request(server)
      .del('/api/recordings/5c843a6d8cb8efbd33657e0a')
      .send();
    expect(res.status).to.equal(200)
    expect(res.body).to.deep.property('data')
    expect(res.body.data).to.be.an('object')
    expect(res.body.data.deleted).to.be.eq(0)
  })
  
  it('should delete recording', async () => {
    const prevData = await await request(server)
      .post('/api/recordings')
      .send({
        name: 'Test record',
        file: 'url file'
      })

    const { body: { data: { _id } } } = prevData;

    const res = await request(server)
      .del(`/api/recordings/${_id}`)
      .send();
    
    expect(res.status).to.equal(200)
    expect(res.body).to.deep.property('data')
    expect(res.body.data).to.be.an('object')
    expect(res.body.data.deleted).to.be.eq(1)
  })
})