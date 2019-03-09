process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../server');

describe('Api atexto', () => {

  describe('GET /', () => {
    it('should return status 200', done => {
      chai.request(server)
      .get('/')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        done();
      });
    });
    it('shoud add new record', done => {
      chai.request(server)
        .post('/api/add')
        .send({
          name: 'Test record',
          file: 'url file'
        })
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.type.should.equal('application/json')
          res.body.should.include.keys('data')
          res.body.data.should.include.keys('_id', 'name', 'file', 'created_at', 'updated_at')
          done()
        })
    })
  });
});
