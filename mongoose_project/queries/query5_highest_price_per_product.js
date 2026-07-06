/**
 * Q5: 对于每种产品，确定供应价格最高的供应商
 * 
 * 思路：对每种产品，遍历其 suppliers 数组，
 * 找出 rubPrice（卢布价格）最高的供应商
 */

const connectDb = require("../dbConnection");
const Products = require("../models/productModel");
const Suppliers = require("../models/supplierModel");

async function query() {
  try {
    await connectDb();

    console.log("=== Q5: 每种产品出价最高的供应商 ===\n");

    const results = await Products.aggregate([
      // 展开 suppliers 数组
      { $unwind: "$suppliers" },
      {
        $lookup: {
          from: "Suppliers",
          localField: "suppliers.supplierId",
          foreignField: "id",
          as: "supplierInfo"
        }
      },
      { $unwind: "$supplierInfo" },
      // 按产品分组，找出最高 rubPrice
      {
        $group: {
          _id: { productId: "$_id", productName: "$name" },
          highestRubPrice: { $max: "$suppliers.rubPrice" },
          suppliers: {
            $push: {
              name: "$supplierInfo.name",
              city: "$supplierInfo.address.city",
              rubPrice: "$suppliers.rubPrice",
              date: "$suppliers.date"
            }
          }
        }
      },
      // 过滤出 rubPrice 等于最高价的供应商
      { $unwind: "$suppliers" },
      {
        $match: {
          $expr: { $eq: ["$suppliers.rubPrice", "$highestRubPrice"] }
        }
      },
      {
        $project: {
          _id: 0,
          productName: "$_id.productName",
          productId: "$_id.productId",
          supplierName: "$suppliers.name",
          supplierCity: "$suppliers.city",
          highestPrice: "$suppliers.rubPrice",
          lastSupplyDate: "$suppliers.date"
        }
      },
      { $sort: { productName: 1 } }
    ]);

    if (results.length === 0) {
      console.log("(No results)");
    } else {
      results.forEach(r => {
        console.log(`  产品: ${r.productName} (${r.productId})`);
        console.log(`    最高价: ${r.highestPrice.toLocaleString()} RUB`);
        console.log(`    供应商: ${r.supplierName} (${r.supplierCity})`);
        console.log();
      });
    }

    process.exit(0);
  } catch (err) {
    console.error("Query error:", err);
    process.exit(1);
  }
}

query();
