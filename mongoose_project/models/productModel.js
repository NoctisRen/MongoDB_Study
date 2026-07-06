const mongoose = require("mongoose");

const supplySchema = mongoose.Schema(
  {
    price: {
      type: Number,
    },
    rubPrice: {
      type: Number,
    },
    date: {
      type: Date,
    },
    supplierId: {
      type: String,
      ref: 'Suppliers'
    }
  },
  { _id: false }
);

const productSchema = mongoose.Schema(
  {
    _id: {
      type: String,
    },
    id: {
      type: String,
    },
    name: {
      type: String,
      required: [true, "Please add the product name"],
    },
    description: {
      type: String,
    },
    stock: {
      type: Number,
    },
    tags: [String],
    suppliers: [supplySchema],
  });

module.exports = mongoose.model("Products", productSchema, "Products");
