const connectDb = require("./dbConnection");
const Suppliers = require("./models/supplierModel");
async function getProducts() {
    const sup = await Suppliers.aggregate([
  {
    $group: {
      _id: '$address.city',
    }
  }
]);
    console.log(JSON.stringify(sup.map( p => p._id), null, 2));
    process.exit(0);
}
connectDb();
getProducts();

