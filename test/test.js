var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
var mongoose = require('mongoose');
var app;
var token;

describe('clear db before testing', () => {

  before('Remove previous users', function(done) {
    this.timeout(5000);
    mongoose.connect('mongodb://whitney:abc@ds059672.mongolab.com:59672/codefellows');
    mongoose.connection.on('connected', () => {
      mongoose.connection.collection('users').drop( () => {
        app = require('../app')(mongoose.connection);
        done();
      });
    });
  });

  after('Close db connection', done => {
    mongoose.connection.close( () => done() );
  });

  describe('protected routes', () => {
    it('should protect the secret route', done => {
      chai.request(app)
      .get('/secret')
      .end( (err, res) => {
        expect(err).to.be.null;
        expect(res.body.msg).to.equal('Invalid Authentication');
        done();
      });
    });
  });

  describe('registering a new user', () => {
    it('should register a new user', function(done) {
      this.timeout(5000);
      chai.request(app)
      .post('/api/signup')
      .send({ username: 'George', password: 'abc' })
      .end( (err, res) => {
        expect(err).to.be.null;
        token = res.body.token;
        done();
      });
    });

    it('should allow access to secret route', done => {
      chai.request(app)
      .get('/secret')
      .set('token', token)
      .end( (err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
    });
  });


  describe('logging in as a registered user', () => {
    it('should return a new token', done => {
      chai.request(app)
      .get('/api/signin')
      .auth('George', 'abc')
      .end( (err, res) => {
        expect(err).to.be.null;
        expect(res.body.token).to.not.equal(null);
        done();
      });
    });
  });

});
