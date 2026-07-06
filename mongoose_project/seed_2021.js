/**
 * 种子脚本：新增 2021 年 Sales 数据以满足 Query 需求
 * 
 * 需求分析：
 *   Q1. 2021年1月采购的产品 → 需要2021年1月的销售记录
 *   Q2. 2021年供应打印机或电脑的供应商名称 → 需要2021年打印机/电脑的销售
 *   Q4. 供应总额>70,000卢布的供应商 → 需要高总金额数据（卢布计价）
 *   Q6. 2021年订单数统计 → 需要足够的2021年数据
 * 
 * 3家供应商:
 *   supplier1=Supplier A (Minsk), supplier2=Supplier B (Vitebsk), supplier3=Supplier C (Minsk)
 * 9种产品:
 *   prod1=Personal Computer, prod2=Printer, prod3=Laptop, prod4=Monitor 24"
 *   prod5=Keyboard, prod6=Mouse, prod7=HDD 1TB, prod8=Webcam HD, prod9=Laser Printer
 */

const connectDb = require("./dbConnection");
const Sales = require("./models/saleModel");

const seedSales2021 = [
  // ---- January 2021 (满足 Q1) ----
  {
    _id: "sale2021_jan1",
    supplierId: "supplier1",
    date: new Date("2021-01-10"),
    items: [
      { productId: "product1", quantity: 5, price: 98000 },  // Computer ×5 @ 98000 RUB
      { productId: "product5", quantity: 10, price: 7500 }   // Keyboard ×10 @ 7500 RUB
    ]
  },
  {
    _id: "sale2021_jan2",
    supplierId: "supplier2",
    date: new Date("2021-01-15"),
    items: [
      { productId: "product1", quantity: 3, price: 97000 },  // Computer ×3
      { productId: "product2", quantity: 8, price: 18500 },  // Printer ×8 @ 18500 RUB
      { productId: "product4", quantity: 10, price: 28000 }  // Monitor ×10
    ]
  },
  {
    _id: "sale2021_jan3",
    supplierId: "supplier3",
    date: new Date("2021-01-20"),
    items: [
      { productId: "product2", quantity: 5, price: 19000 },  // Printer ×5
      { productId: "product6", quantity: 20, price: 4500 }   // Mouse ×20
    ]
  },

  // ---- February - June 2021 ----
  {
    _id: "sale2021_feb",
    supplierId: "supplier1",
    date: new Date("2021-02-15"),
    items: [
      { productId: "product3", quantity: 4, price: 145000 }, // Laptop ×4
      { productId: "product7", quantity: 6, price: 11000 }   // HDD ×6
    ]
  },
  {
    _id: "sale2021_mar",
    supplierId: "supplier2",
    date: new Date("2021-03-05"),
    items: [
      { productId: "product9", quantity: 2, price: 42000 },  // Laser Printer ×2
      { productId: "product4", quantity: 8, price: 27500 }   // Monitor ×8
    ]
  },
  {
    _id: "sale2021_apr",
    supplierId: "supplier3",
    date: new Date("2021-04-10"),
    items: [
      { productId: "product3", quantity: 2, price: 148000 }, // Laptop ×2
      { productId: "product5", quantity: 15, price: 7200 }   // Keyboard ×15
    ]
  },
  {
    _id: "sale2021_may",
    supplierId: "supplier1",
    date: new Date("2021-05-20"),
    items: [
      { productId: "product2", quantity: 10, price: 18000 }, // Printer ×10 (满足Q2)
      { productId: "product6", quantity: 30, price: 4200 }   // Mouse ×30
    ]
  },
  {
    _id: "sale2021_jun",
    supplierId: "supplier2",
    date: new Date("2021-06-01"),
    items: [
      { productId: "product8", quantity: 5, price: 8500 },   // Webcam ×5
      { productId: "product1", quantity: 2, price: 99000 }   // Computer ×2 (supplier2 供应电脑)
    ]
  },

  // ---- July - December 2021 ----
  {
    _id: "sale2021_jul",
    supplierId: "supplier3",
    date: new Date("2021-07-15"),
    items: [
      { productId: "product9", quantity: 3, price: 43000 },  // Laser Printer ×3 (supplier3 供应打印机)
      { productId: "product7", quantity: 10, price: 10800 }  // HDD ×10
    ]
  },
  {
    _id: "sale2021_aug",
    supplierId: "supplier1",
    date: new Date("2021-08-05"),
    items: [
      { productId: "product3", quantity: 5, price: 142000 }, // Laptop ×5
      { productId: "product4", quantity: 12, price: 26000 }  // Monitor ×12
    ]
  },
  {
    _id: "sale2021_sep",
    supplierId: "supplier2",
    date: new Date("2021-09-10"),
    items: [
      { productId: "product3", quantity: 1, price: 150000 }, // Laptop ×1
      { productId: "product8", quantity: 8, price: 8200 }    // Webcam ×8
    ]
  },
  {
    _id: "sale2021_oct",
    supplierId: "supplier1",
    date: new Date("2021-10-01"),
    items: [
      { productId: "product5", quantity: 25, price: 7000 },  // Keyboard ×25
      { productId: "product6", quantity: 40, price: 4000 }   // Mouse ×40
    ]
  },
  {
    _id: "sale2021_nov",
    supplierId: "supplier3",
    date: new Date("2021-11-20"),
    items: [
      { productId: "product1", quantity: 4, price: 96000 },  // Computer ×4 (supplier3 供应电脑 → Q2)
      { productId: "product4", quantity: 6, price: 29000 }   // Monitor ×6
    ]
  },
  {
    _id: "sale2021_dec",
    supplierId: "supplier2",
    date: new Date("2021-12-15"),
    items: [
      { productId: "product2", quantity: 12, price: 17500 }, // Printer ×12 (supplier2 供应打印机 → Q2)
      { productId: "product9", quantity: 1, price: 44000 }   // Laser Printer ×1
    ]
  }
];

// 补充：给每个 Products 添加卢布价格字段（用于 Q5 查询最高价供应商）
const updateProductRubPrices = async () => {
  const mongoose = require("mongoose");
  const Product = require("./models/productModel");
  
  // 美元 → 卢布 汇率 ~90
  const rubPrices = {
    "product1": 90000,  // Personal Computer
    "product2": 18000,  // Printer
    "product3": 135000, // Laptop
    "product4": 27000,  // Monitor 24"
    "product5": 7200,   // Keyboard
    "product6": 4500,   // Mouse
    "product7": 10800,  // External HDD 1TB
    "product8": 8100,   // Webcam HD
    "product9": 40500   // Laser Printer
  };
  
  for (const [prodId, rubPrice] of Object.entries(rubPrices)) {
    // 在 suppliers 数组中添加 rubPrice 字段（已有美元 price）
    await Product.updateOne(
      { _id: prodId },
      { $set: { "suppliers.$[].rubPrice": rubPrice } }
    );
  }
  console.log("✅ Updated all products with rubPrice in suppliers array");
};

async function run() {
  try {
    await connectDb();
    
    console.log("\n⏳ Seeding 2021 sale records...");
    
    // 清除旧的 2021 数据（如果有）
    await Sales.deleteMany({ date: { $gte: new Date("2021-01-01"), $lte: new Date("2021-12-31") } });
    
    // 插入新数据
    const result = await Sales.insertMany(seedSales2021);
    console.log(`✅ Inserted ${result.length} sales records for 2021`);
    
    // 统计每家供应商的总额
    const stats = await Sales.aggregate([
      { $match: { date: { $gte: new Date("2021-01-01"), $lte: new Date("2021-12-31") } } },
      { $unwind: "$items" },
      { $group: {
        _id: "$supplierId",
        totalAmount: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        totalSales: { $sum: 1 }
      }},
      { $sort: { totalAmount: -1 } }
    ]);
    
    console.log("\n📊 2021 Sales Statistics:");
    stats.forEach(s => {
      console.log(`  Supplier ${s._id}: ${s.totalSales} sales, total = ${s.totalAmount.toLocaleString()} RUB`);
    });
    
    await updateProductRubPrices();
    
    console.log("\n🎉 Seeding complete! Database ready for queries.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

run();
