import chai from 'chai';
import chaiHttp from 'chai-http';

import cleanDB from '../utils';
const server = require('../server');

import { validFile, invalidFile, contentType } from './fixtures/recordings';

chai.use(chaiHttp);
const { expect, request } = chai;

describe('Add /', () => {
  beforeEach(async () => {
    await cleanDB()
  })

  it('should return status 200', async () => {
    const res = await request(server)
      .get('/')
    expect(res.status).to.equal(200)
    expect(res.body.status).to.equal('success')
  });

  it('should return error if not provide data', async () => {
    const res = await request(server)
      .post('/api/recordings')
      .send()

    expect(res.status).to.equal(400)
    expect(res.body.status).to.equal('error')
  })

  it('should return error if name is not provided', async () => {
    const res = await request(server)
      .post('/api/recordings')
      .send({
        file: 'url file'
      })
    expect(res.status).to.equal(400)
    expect(res.body.status).to.equal('error')
    expect(res.body.errors).to.be.an('array')
    expect(res.body.errors[0]).to.have.key('path', 'message')
    expect(res.body.errors[0]).to.have.keys('path', 'message')
    expect(res.body.errors[0].path).to.equal('name')
    expect(res.body.errors[0].message).to.equal('El nombre del archivo es obligatorio')
  })

  it('should return error if file is not provided', async () => {
    const res = await request(server)
      .post('/api/recordings')
      .send({
        name: 'name file'
      })
    expect(res.status).to.equal(400)
    expect(res.body.status).to.equal('error')
    expect(res.body.errors).to.be.an('array')
    expect(res.body.errors[0]).to.have.key('path', 'message')
    expect(res.body.errors[0].path).to.equal('file')
    expect(res.body.errors[0].message).to.equal('Sucedió un error al subir la grabación')
  })

  it.skip('shoud return error if file is invalid', async () => {
    const res = await request(server)
      .post('/api/recordings')
      .set('Content-Type', contentType)
      .send(invalidFile)

      expect(res.status).to.equal(400)
      expect(res.body.status).to.equal('error')
      expect(res.body.errors).to.be.an('array')
      expect(res.body.errors[0]).to.have.key('path', 'message')
      expect(res.body.errors[0].path).to.equal('file')
      expect(res.body.errors[0].message).to.equal('Formato de archivo incorrecto')
  })

  it('shoud add new recording', async () => {
    const res = await request(server)
      .post('/api/recordings')
      .set('Content-Type', contentType)
      .send(validFile)
    expect(res.status).to.equal(200)
    expect(res.type).to.equal('application/json')
    expect(res.body).to.deep.property('data')
    expect(res.body.data).to.have.any.keys('_id', 'name', 'file', 'created_at', 'updated_at')
  })

  it('should return empty recording list', async () => {
    const res = await request(server)
      .get('/api/recordings')
      .send()
    expect(res.status).to.equal(200)
    expect(res.type).to.equal('application/json')
    expect(res.body).to.deep.property('data')
    expect(res.body.data).to.be.an('array')
    expect(res.body.data).to.have.length(0)
  })


  it('should return recording list', async () => {
    await request(server)
      .post('/api/recordings')
      .set('Content-Type', contentType)
      .send(validFile)
    
      await request(server)
      .post('/api/recordings')
      .set('Content-Type', contentType)
      .send(validFile)

    const res = await request(server)
      .get('/api/recordings')
      .send()
    expect(res.status).to.equal(200)
    expect(res.type).to.equal('application/json')
    expect(res.body).to.deep.property('data')
    expect(res.body.data).to.be.an('array')
    expect(res.body.data).to.have.length.greaterThan(0)
    expect(res.body.data[0]).to.have.any.keys('_id', 'name', 'file', 'created_at', 'updated_at')

  })
});
