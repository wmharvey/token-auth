var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
var mongoose = require('mongoose');

var User = require('../models/user')('Test');
var app = require('../app')('Test');
var agent = chai.request.agent(app);

describe('clear db before testing', () => {

  before('Remove previous users', done => {
    mongoose.connect('mongodb://localhost/passport_demo');
    mongoose.connection.on('connected', () => {
      mongoose.connection.collection('tests').drop( () => done() );
    });
  });

  after('Close db connection', done => {
    mongoose.connection.close( () => done() );
  });

  describe('protected routes', () => {
    it('should redirect to home page', done => {
      chai.request(app)
      .get('/secret')
      .redirects(0)
      .end( (err, res) => {
        expect(err).to.be.null;
        expect(res).to.redirectTo('/');
        done();
      });
    });
  });

  describe('registering a new user', () => {
    it('should register a new user', function(done) {
      this.timeout(5000);
      agent
      .post('/register')
      .redirects(0)
      .send({ username: 'george', password: 'abc' })
      .then( (res) => {
        expect(res).to.redirectTo('/secret');
        done();
      })
      .catch(done);
    });

    it('should allow access to secret route', done => {
      agent
      .get('/secret')
      .redirects(0)
      .then( (res) => {
        expect(res).to.have.status(200);
        done();
      })
      .catch(done);
    });
  });

  describe('logging out', () => {

    it('should log a user out', done => {
      agent
      .get('/logout')
      .then( (res) => {
        agent.get('/secret').redirects(0)
          .then( res => {
            expect(res).to.redirectTo('/');
            done();
          })
          .catch(done);
      })
      .catch(done);
    });

  });

  describe('logging in as a registered user', () => {
    it('should allow logins', done => {
      agent
      .post('/login')
      .send({ username: 'george', password: 'abc' })
      .then( res => {
        agent.get('/secret').redirects(0)
          .then( res => {
            expect(res).to.have.status(200);
            done();
          })
          .catch(done);
      })
      .catch(done);
    });
  });

});
