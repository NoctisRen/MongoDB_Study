const mongoose = require("mongoose");

const saleItemSchema = mongoose.Schema(
  {
    productId: {
      type: String,
      ref: 'Products'
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const saleSchema = mongoose.Schema(
  {
    _id: {
      type: String
    },
    supplierId: {
      type: String,
      ref: 'Suppliers',
      required: [true, "Please add the supplier id"]
    },
    date: {
      type: Date,
      required: [true, "Please add the sale date"]
    },
    items: [saleItemSchema]
  });

module.exports = mongoose.model("Sales", saleSchema, "Sales");
