const router = require("express").Router();
const Client = require("../models/Client");
const Item = require("../models/Item");
const Invoice = require("../models/Invoice");

// GET /api/dashboard/summary
router.get("/summary", async (req, res) => {
  try {
    const clientCount = await Client.countDocuments();
    const itemCount = await Item.countDocuments();
    const invoiceCount = await Invoice.countDocuments();

    res.json({
      clientCount,
      itemCount,
      invoiceCount,
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
