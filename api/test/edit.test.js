import chai from 'chai';
import chaiHttp from 'chai-http';

import cleanDB from '../utils';
const server = require('../server');

import { validFile, contentType } from './fixtures/recordings';

chai.use(chaiHttp);
const { expect, request } = chai;

describe('Edit', () => {
  beforeEach(async () => {
    await cleanDB()
  })

  it('should return error if id is invalid', async () => {
    const res = await request(server)
      .put('/api/recordings/0')
      .send()
    expect(res.status).to.equal(400)
    expect(res.body.errors).to.be.an('array')
    expect(res.body.errors[0]).to.have.key('path', 'message')
    expect(res.body.errors[0].path).to.equal('id')
    expect(res.body.errors[0].message).to.equal('Parametro inválido')
  });

  it('should return error if recording not exists', async () => {
    const res = await request(server)
      .put('/api/recordings/5c8413132c97dda692377a3c')
      .send({
        name: 'new name'
      })
    expect(res.status).to.equal(400)
    expect(res.body.errors).to.be.an('array')
    expect(res.body.errors[0]).to.have.key('path', 'message')
    expect(res.body.errors[0].path).to.equal('id')
    expect(res.body.errors[0].message).to.equal('Grabación no existente')
  })

  it('should update recording', async() => {
    const prevData = await await request(server)
      .post('/api/recordings')
      .set('Content-Type', contentType)
      .send(validFile)

    const { body: { data: { _id, name } } } = prevData;

    const res = await request(server)
      .put(`/api/recordings/${_id}`)
      .send({
        name: 'new name'
      })
  
    expect(res.status).to.equal(200)
    expect(res.type).to.equal('application/json')
    expect(res.body).to.deep.property('data')
    expect(res.body.data).to.have.any.keys('_id', 'name', 'file', 'created_at', 'updated_at')
    expect(res.body.data.name).to.not.eql(name)
    expect(res.body.data.name).to.equal('new name')
  })
})