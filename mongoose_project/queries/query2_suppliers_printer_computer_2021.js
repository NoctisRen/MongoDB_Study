/**
 * Q2: 获取 2021 年供应打印机(printer)或电脑(computer)的供应商名称
 * 
 * 思路：在 Sales 中查找 2021 年的记录，
 * 通过 productId 关联到 Products，筛选 tags 包含 "printer" 或 "computer" 的商品，
 * 再关联 supplierId 到 Suppliers 获取供应商名称
 */

const connectDb = require("../dbConnection");
const Sales = require("../models/saleModel");
const Suppliers = require("../models/supplierModel");

async function query() {
  try {
    await connectDb();

    console.log("=== Q2: 2021 年供应打印机或电脑的供应商名称 ===\n");

    const results = await Sales.aggregate([
      {
        $match: {
          date: {
            $gte: new Date("2021-01-01"),
            $lt: new Date("2022-01-01")
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
      // 筛选 tags 包含 "printer" 或 "computer" 的产品
      {
        $match: {
          $or: [
            { "productInfo.tags": "printer" },
            { "productInfo.tags": "computer" }
          ]
        }
      },
      {
        $lookup: {
          from: "Suppliers",
          localField: "supplierId",
          foreignField: "id",
          as: "supplierInfo"
        }
      },
      { $unwind: "$supplierInfo" },
      {
        $group: {
          _id: "$supplierId",
          supplierName: { $first: "$supplierInfo.name" },
          city: { $first: "$supplierInfo.address.city" },
          products: { $addToSet: "$productInfo.name" },
          totalQuantity: { $sum: "$items.quantity" }
        }
      },
      { $sort: { supplierName: 1 } }
    ]);

    if (results.length === 0) {
      console.log("(No suppliers found for printer/computer in 2021)");
    } else {
      results.forEach(r => {
        console.log(`  供应商: ${r.supplierName} (ID: ${r._id})`);
        console.log(`  城市: ${r.city}`);
        console.log(`  供应的品类: ${r.products.join(", ")}`);
        console.log(`  总供货数量: ${r.totalQuantity}\n`);
      });
    }

    process.exit(0);
  } catch (err) {
    console.error("Query error:", err);
    process.exit(1);
  }
}

query();
