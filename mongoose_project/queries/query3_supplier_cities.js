/**
 * Q3: 获取从哪些城市发过货（提供过货物的城市列表）
 * 
 * 思路：从 Suppliers 集合中提取所有不同的 address.city
 * （这是通过 mongoose 的 suppliers catalog 实现的）
 */

const connectDb = require("../dbConnection");
const Suppliers = require("../models/supplierModel");

async function query() {
  try {
    await connectDb();

    console.log("=== Q3: 提供过货物的城市列表 ===\n");

    const results = await Suppliers.aggregate([
      {
        $group: {
          _id: "$address.city",
          supplierCount: { $sum: 1 },
          suppliers: { $addToSet: "$name" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    if (results.length === 0) {
      console.log("(No cities found)");
    } else {
      console.log(`共 ${results.length} 个城市:\n`);
      results.forEach(r => {
        console.log(`  ${r._id} — ${r.supplierCount} 家供应商`);
        r.suppliers.forEach(s => console.log(`    - ${s}`));
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
