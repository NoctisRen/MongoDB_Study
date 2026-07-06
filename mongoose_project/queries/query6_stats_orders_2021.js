/**
 * Q6: 获取 2021 年订单统计
 * 
 * 思路：统计 2021 年全年的订单数量（按月分组显示趋势）
 */

const connectDb = require("../dbConnection");
const Sales = require("../models/saleModel");

async function query() {
  try {
    await connectDb();

    console.log("=== Q6: 2021 年订单统计 ===\n");

    // 按月统计订单数
    const monthlyStats = await Sales.aggregate([
      {
        $match: {
          date: {
            $gte: new Date("2021-01-01"),
            $lt: new Date("2022-01-01")
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          orderCount: { $sum: 1 },
          totalItems: { $sum: { $size: "$items" } },
          totalAmount: {
            $sum: {
              $sum: {
                $map: {
                  input: "$items",
                  as: "item",
                  in: { $multiply: ["$$item.quantity", "$$item.price"] }
                }
              }
            }
          }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    const monthNames = [
      "一月", "二月", "三月", "四月", "五月", "六月",
      "七月", "八月", "九月", "十月", "十一月", "十二月"
    ];

    if (monthlyStats.length === 0) {
      console.log("(No orders found in 2021)");
    } else {
      let totalOrders = 0;
      let totalAmountAll = 0;

      monthlyStats.forEach(r => {
        const monthName = monthNames[r._id.month - 1];
        console.log(`  ${r._id.year}年 ${monthName}:`);
        console.log(`    订单数: ${r.orderCount}`);
        console.log(`    商品件数: ${r.totalItems}`);
        console.log(`    金额: ${r.totalAmount.toLocaleString()} RUB\n`);
        totalOrders += r.orderCount;
        totalAmountAll += r.totalAmount;
      });

      console.log("  ─────────────────────────────");
      console.log(`  2021 年总计:`);
      console.log(`    总订单数: ${totalOrders}`);
      console.log(`    总金额: ${totalAmountAll.toLocaleString()} RUB\n`);

      // 按供应商统计
      const supplierStats = await Sales.aggregate([
        {
          $match: {
            date: {
              $gte: new Date("2021-01-01"),
              $lt: new Date("2022-01-01")
            }
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
            _id: "$supplierInfo.name",
            orderCount: { $sum: 1 },
            totalAmount: {
              $sum: {
                $sum: {
                  $map: {
                    input: "$items",
                    as: "item",
                    in: { $multiply: ["$$item.quantity", "$$item.price"] }
                  }
                }
              }
            }
          }
        },
        { $sort: { totalAmount: -1 } }
      ]);

      console.log("  按供应商统计:");
      supplierStats.forEach(s => {
        console.log(`    ${s._id}: ${s.orderCount} 单, ${s.totalAmount.toLocaleString()} RUB`);
      });
    }

    process.exit(0);
  } catch (err) {
    console.error("Query error:", err);
    process.exit(1);
  }
}

query();
