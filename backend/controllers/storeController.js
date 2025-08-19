import products from "../data.js";

// function for stock analysis
const analyzeStock = (req, res) => {
  const report = products.map((product) => {
    const dayRemaining = Math.floor(product.currentStock / product.dailySales);
    let bufferDays;
    if (product.criticality === "high") {
      bufferDays = 7;
    } else if (product.criticality === "medium") {
      bufferDays = 5;
    } else {
      bufferDays = 2;
    }
    const saftyStock = (product.leadTime + bufferDays) * product.dailySales;

    // Calculate stock needed for 1month
    const targetStock = 60 * product.dailySales;

    //check if reorder is needed
    const needReorder = product.currentStock < saftyStock;

    const reorderQty = needReorder
      ? Math.max(product.minReorderQty, targetStock - product.currentStock)
      : 0;

    const baseReport = {
      productId: product.id,
      productName: product.name,
      currentStock: product.currentStock,
      dayRemaining: dayRemaining,
    };
    //check if reorderQty is greater than 0 and send report
    if (reorderQty > 0) {
      const reorderCost = reorderQty * product.costPerUnit;
      return {
        ...baseReport,
        reorderQty: reorderQty,
        reorderCost: reorderCost,
        message: "Reorder required",
      };
    }
    return {
      ...baseReport,
      message: "No reorder needed",
    };
  });
  res.json(report);
};
// Function to simulate a sales spike
const simulateSpike = (req, res) => {
  const { productId, multiplier = 3, spikeDays = 7 } = req.body;

  const product = products.find((p) => p.id == productId);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  console.log(product);
  const newDailySales = product.dailySales * multiplier;
  let newCurrentStock = product.currentStock - newDailySales * spikeDays;
  if (newCurrentStock < 0) newCurrentStock = 0;

  res.json({
    productId: product.id,
    productName: product.name,
    originalDailySales: product.dailySales,
    originalCurrentStock: product.currentStock,
    spikeMultiplier: multiplier,
    spikeDays: spikeDays,
    newDailySales,
    newCurrentStock,
  });
};
// Function to fetch all productsIs
const fetchProducts = (req, res) => {
  res.json(products);
};
// function to add a new product
const addProducts = (req, res) => {
  const { name, stock, dailySales, leadTime, minReorder, cost,criticality } = req.body;

  // Check if product already exists by name
  const existing = products.find(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  );
  if (existing) {
    return res
      .status(400)
      .json({ message: "Product already exists", product: existing });
  }

  // Generate new ID
  const newId = products.length;

  const newProduct = {
    id: newId,
    name,
    currentStock: Number(stock),
    dailySales: Number(dailySales),
    leadTime: Number(leadTime),
    minReorderQty: Number(minReorder),
    costPerUnit: Number(cost),
    criticality
  };

  // Add to products array
  products.push(newProduct);

  res.json({
    message: "Product added successfully",
    product: newProduct,
  });
};

export { analyzeStock, simulateSpike, fetchProducts, addProducts };
