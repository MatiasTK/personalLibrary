'use strict';

const {
  createBook,
  getAllBooks,
  getBook,
  commentBook,
  deleteAllBooks,
  deleteBook,
} = require('../controllers/book.controller');

module.exports = function (app) {
  app
    .route('/api/books')
    .get(getAllBooks)

    .post(createBook)

    .delete(deleteAllBooks);

  app
    .route('/api/books/:id')
    .get(getBook)

    .post(commentBook)

    .delete(deleteBook);
};
