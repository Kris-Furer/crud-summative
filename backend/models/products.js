const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number,
  image: String,
  console: String,
  genre: String,
  description: String,
  seller: String,
  itemLocation: String,
  condition: String,

  created_at: {
    type: Date,
    required: true,
    default: Date.now
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: {
    type: Array,
    require: true
  }

})

module.exports = mongoose.model('Product', productSchema);
