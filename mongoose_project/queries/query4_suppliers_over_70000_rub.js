/**
 * Q4: 获取供应总额超过 70,000 卢布的供应商信息
 * 
 * 思路：通过 Sales 关联到 Suppliers，计算每家供应商的总供应金额，
 * 筛选超过 70,000 卢布的（使用 items.price × quantity 计算）
 * 
 * 注意：文档中要求 "商品总金额超过 70,000 卢布"
 * 这里的金额已在种子数据中以卢布（RUB）计价
 */

const connectDb = require("../dbConnection");
const Sales = require("../models/saleModel");
const Suppliers = require("../models/supplierModel");

async function query() {
  try {
    await connectDb();

    console.log("=== Q4: 供应总额超过 70,000 卢布的供应商 ===\n");

    const results = await Sales.aggregate([
      { $unwind: "$items" },
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
          phoneNumber: { $first: "$supplierInfo.phoneNumber" },
          city: { $first: "$supplierInfo.address.city" },
          totalAmount: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] }
          },
          saleCount: { $sum: 1 },
          productsSupplied: { $addToSet: "$items.productId" }
        }
      },
      // 筛选总金额 > 70,000 RUB
      { $match: { totalAmount: { $gt: 70000 } } },
      { $sort: { totalAmount: -1 } }
    ]);

    if (results.length === 0) {
      console.log("(No suppliers with total over 70,000 RUB)");
    } else {
      results.forEach(r => {
        console.log(`  供应商: ${r.supplierName}`);
        console.log(`  电话: ${r.phoneNumber}`);
        console.log(`  城市: ${r.city}`);
        console.log(`  供应总额: ${r.totalAmount.toLocaleString()} RUB`);
        console.log(`  订单数: ${r.saleCount}\n`);
      });
    }

    process.exit(0);
  } catch (err) {
    console.error("Query error:", err);
    process.exit(1);
  }
}

query();
