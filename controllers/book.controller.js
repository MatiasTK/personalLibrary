const book = require('../models/Book.js');
const Book = require('../models/Book.js');

const createBook = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.send('missing required field title');
  }

  const newBook = new Book({ title: title, commentcount: 0, comments: [] });
  await newBook.save();

  res.json(newBook);
};

const getAllBooks = async (req, res) => {
  const books = await Book.find();

  res.json(books);
};

const getBook = async (req, res) => {
  const bookId = req.params.id;

  const book = await Book.findById(bookId);

  if (!book) {
    return res.send('no book exists');
  }

  res.json(book);
};

const commentBook = async (req, res) => {
  const bookId = req.params.id;
  const comment = req.body.comment;

  if (!comment) {
    return res.send('missing required field comment');
  }

  const updatedBook = await Book.findByIdAndUpdate(
    bookId,
    { $push: { comments: comment }, $inc: { commentcount: 1 } },
    { new: true }
  );

  if (!updatedBook) {
    return res.send('no book exists');
  }

  return res.json(updatedBook);
};

const deleteBook = async (req, res) => {
  const bookId = req.params.id;

  const deleteBook = await Book.findByIdAndDelete(bookId);

  if (!deleteBook) {
    return res.send('no book exists');
  }

  return res.send('delete successful');
};

const deleteAllBooks = async (req, res) => {
  await Book.deleteMany({});

  return res.send('complete delete successful');
};

module.exports = { createBook, getAllBooks, getBook, commentBook, deleteBook, deleteAllBooks };
