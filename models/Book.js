const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  commentcount: { type: Number, required: true},
  comments: [
    {type: String, required: false}
  ]
});

module.exports = mongoose.model('Book', BookSchema);