// init model schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create product model schema
const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("Products", productSchema);
module.exports = Product;
