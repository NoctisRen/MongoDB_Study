const connectDb = require("./dbConnection");
const Product = require("./models/productModel");
async function getProducts() {
    const prod1 = await Product.find();
    console.log(`get ${prod1}`);
}
connectDb();
getProducts();

