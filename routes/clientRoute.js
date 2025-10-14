const router = require("express").Router();
const Client = require("../models/Client");
const Invoice = require("../models/Invoice");

// Create a new client
router.post("/", async (req, res) => {
  const newClient = new Client(req.body);
  try {
    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
// Get all clients
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json(err);
  }
});
// Get a single client by ID
router.get("/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    const clientInvoices = await Invoice.find({ client: client._id })
      .sort({ createdAt: -1 })
      .populate("client")
      .populate("items.item")
      .lean();

    function calculateTotals(items = []) {
      const totals = items.reduce(
        (acc, row) => {
          const qty = row.qty || 0;
          const sgstRate = row.sgst || 0;
          const cgstRate = row.cgst || 0;
          const rate = row.item?.price
            ? row.item.price / (1 + (sgstRate + cgstRate) / 100)
            : 0;
          const lineSubtotal = qty * rate;

          acc.subtotal += lineSubtotal;
          acc.totalSGST += (lineSubtotal * sgstRate) / 100;
          acc.totalCGST += (lineSubtotal * cgstRate) / 100;
          acc.totalQty += qty;

          // For most frequent item
          const itemId = row.item?._id?.toString() || row.item?.toString();
          if (itemId) acc.itemCounts[itemId] = (acc.itemCounts[itemId] || 0) + qty;

          return acc;
        },
        { subtotal: 0, totalSGST: 0, totalCGST: 0, totalQty: 0, itemCounts: {} }
      );
      const grandTotal = totals.subtotal + totals.totalSGST + totals.totalCGST;
      return { ...totals, grandTotal };
    }

    // Aggregate stats over all invoices
    let totalInvoices = clientInvoices.length;
    let sumSubtotal = 0, sumSGST = 0, sumCGST = 0, sumGrand = 0, sumQty = 0;
    let itemCounts = {};
    let firstInvoiceDate = null, lastInvoiceDate = null;

    clientInvoices.forEach((inv, idx) => {
      const { subtotal, totalSGST, totalCGST, grandTotal, totalQty, itemCounts: counts } = calculateTotals(inv.items);
      sumSubtotal += subtotal;
      sumSGST += totalSGST;
      sumCGST += totalCGST;
      sumGrand += grandTotal;
      sumQty += totalQty;
      for (const [item, c] of Object.entries(counts)) {
        itemCounts[item] = (itemCounts[item] || 0) + c;
      }
      // Dates: first = oldest, last = most recent
      if (idx === 0) lastInvoiceDate = inv.date;
      if (idx === clientInvoices.length - 1) firstInvoiceDate = inv.date;
    });

    let mostFrequentItemId = null, maxQty = 0;
    Object.entries(itemCounts).forEach(([itemId, qty]) => {
      if (qty > maxQty) {
        mostFrequentItemId = itemId;
        maxQty = qty;
      }
    });

    let mostFrequentItem = null;
    if (mostFrequentItemId) {
      for (const inv of clientInvoices) {
        for (const it of inv.items) {
          if (
            (it.item?._id?.toString() || it.item?.toString()) === mostFrequentItemId
          ) {
            mostFrequentItem = it.item;
            break;
          }
        }
        if (mostFrequentItem) break;
      }
    }

    const averageInvoiceValue = totalInvoices ? sumGrand / totalInvoices : 0;

    const clientStatistics = {
      totalInvoices,
      totalBilled: sumGrand,
      subtotal: sumSubtotal,
      totalSGST: sumSGST,
      totalCGST: sumCGST,
      averageInvoiceValue,
      totalQty: sumQty,
      firstInvoiceDate,
      lastInvoiceDate,
      mostFrequentItem,
    };

    res.status(200).json({ client, clientInvoices, clientStatistics });
  } catch (err) {
    res.status(500).json(err);
  }
});
// Update a client by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedClient);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a client by ID
router.delete("/:id", async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
