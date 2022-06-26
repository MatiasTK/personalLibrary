/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const requester = chai.request(server).keepOpen();
let firstId;

suite('Functional Tests', function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test('#example Test GET /api/books', function (done) {
    chai
      .request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite('Routing tests', function () {
    suite('POST /api/books with title => create book object/expect book object', function () {
      test('Test POST /api/books with title', function (done) {
        requester
          .post('/api/books')
          .send({ title: 'Introduction to testing II' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            const { title, commentcount, comments } = res.body;
            firstId = res.body._id;

            assert.equal(title, 'Introduction to testing II');
            assert.equal(commentcount, 0);
            assert.isArray(comments);
            assert.equal(comments.length, 0);
            done();
          });
      });

      test('Test POST /api/books with no title given', function (done) {
        requester.post('/api/books').end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field title');
          done();
        });
      });
    });

    suite('GET /api/books => array of books', function () {
      test('Test GET /api/books', function (done) {
        requester.get('/api/books').end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isString(res.body[0].title);
          assert.isString(res.body[0]._id);
          assert.isArray(res.body[0].comments);
          assert.isAtLeast(res.body[0].commentcount, 0);
          done();
        });
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function () {
      test('Test GET /api/books/[id] with id not in db', function (done) {
        requester.get('/api/books/000000000000000000000000').end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        requester.get(`/api/books/${firstId}`).end((err, res) => {
          assert.equal(res.status, 200);

          const { title, commentcount, comments } = res.body;

          assert.equal(title, 'Introduction to testing II');
          assert.equal(commentcount, 0);
          assert.isArray(comments);
          assert.equal(comments.length, 0);
          done();
        });
      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function () {
      test('Test POST /api/books/[id] with comment', function (done) {
        requester
          .post(`/api/books/${firstId}`)
          .send({ comment: 'This book is amazing!!' })
          .end((err, res) => {
            assert.equal(res.status, 200);

            const { title, commentcount, comments } = res.body;

            assert.equal(title, 'Introduction to testing II');
            assert.equal(commentcount, 1);
            assert.isArray(comments);
            assert.equal(comments.length, 1);
            assert.equal(comments[0], 'This book is amazing!!');
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        requester.post(`/api/books/${firstId}`).end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field comment');
          done();
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        requester
          .post('/api/books/000000000000000000000000')
          .send({ comment: 'This book is amazing!!' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
    });

    suite('DELETE /api/books/[id] => delete book object id', function () {
      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        requester.del(`/api/books/${firstId}`).end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'delete successful');
          done();
        });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        requester.del('/api/books/000000000000000000000000').end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
      });
    });
  });
}).afterAll(() => requester.close());
