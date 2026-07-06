/**
 * Q1: 获取 2021 年 1 月采购的产品列表
 * 
 * 思路：在 Sales 集合中查找 date 在 2021 年 1 月的记录，
 * 提取所有 items 中的 productId，再去 Products 集合中获取产品名称
 */

const connectDb = require("../dbConnection");
const Sales = require("../models/saleModel");
const Products = require("../models/productModel");

async function query() {
  try {
    await connectDb();

    console.log("=== Q1: 2021 年 1 月采购的产品列表 ===\n");

    // 查找 2021 年 1 月的销售记录，展开 items
    const results = await Sales.aggregate([
      {
        $match: {
          date: {
            $gte: new Date("2021-01-01"),
            $lt: new Date("2021-02-01")
          }
        }
      },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "Products",
          localField: "items.productId",
          foreignField: "id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      {
        $group: {
          _id: "$items.productId",
          productName: { $first: "$productInfo.name" },
          totalQuantity: { $sum: "$items.quantity" },
          totalAmount: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    if (results.length === 0) {
      console.log("(No results found for January 2021)");
    } else {
      results.forEach(r => {
        console.log(`  产品: ${r.productName} (${r._id})`);
        console.log(`    采购数量: ${r.totalQuantity}`);
        console.log(`    采购总额: ${r.totalAmount.toLocaleString()} RUB\n`);
      });
    }

    process.exit(0);
  } catch (err) {
    console.error("Query error:", err);
    process.exit(1);
  }
}

query();
