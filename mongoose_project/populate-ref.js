const connectDb = require("./dbConnection");
const Product = require("./models/productModel");
async function getSupplier() {
    const prod1 = await Product.
        findOne({ name: 'Printer' }).
 //       populate('suppliers.supplierId').
        exec();
    console.log(`get ${prod1.suppliers}`);
    process.exit(0);
}
connectDb();
getSupplier();
//