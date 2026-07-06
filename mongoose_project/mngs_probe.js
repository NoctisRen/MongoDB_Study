const connectDb = require("./dbConnection");
const Product = require("./models/productModel");
const product = Product.create({
    id: "Prod88",
    name: "Comp",
    price: 123,
    stock: 222,
});
console.log(`get ${product}, ${product._id}`);
connectDb();
