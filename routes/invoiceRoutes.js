const express = require("express");
const Invoice = require("../models/Invoice");
const Item = require("../models/Item");
const router = express.Router();

// calculate totals from payload lines
function buildInvoiceLines(lines = []) {
  let subtotal = 0;
  let totalGST = 0;
  const mapped = lines.map((l) => {
    const qty = Number(l.qty) || 0;
    const price = Number(l.price) || 0;
    const gstPercent = Number(l.gstPercent) || 0;
    const { lineTotal, gstAmount, grossTotal } = calcLine({
      qty,
      price,
      gstPercent,
    });
    subtotal += lineTotal;
    totalGST += gstAmount;
    return {
      item: l.item || null,
      description: l.description || "",
      qty,
      unit: l.unit || l.unit === "" ? l.unit : "pcs",
      price,
      gstPercent,
      lineTotal,
      gstAmount,
      grossTotal,
    };
  });
  const grandTotal = subtotal + totalGST;
  return { mapped, subtotal, totalGST, grandTotal };
}

function calcLine({ qty, price, gstPercent }) {
  const lineTotal = qty * price;
  const gstAmount = (lineTotal * gstPercent) / 100;
  const grossTotal = lineTotal + gstAmount;
  return { lineTotal, gstAmount, grossTotal };
}

// list invoices JSON
router.get("/", async (req, res) => {
  const invoices = await Invoice.find()
    .populate("client")
    .sort({ createdAt: -1 })
    .populate("items.item")
    .lean();
  res.json(invoices);
});

// create invoice
router.post("/", async (req, res) => {
  try {
    const { client, workName, date, items, notes, total, from, workCode } =
      req.body;
    const invoiceNumber = "IN-" + new Date().getTime(); // Generate a unique invoice number


    const invoice = await Invoice.create({
      invoiceNumber,
      client,
      workName,
      workCode,
      date,
      items,
      total,
      notes,
      from,
    });

    res.status(201).json(invoice);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to create invoice" });
  }
});

// get invoice by id
router.get("/:id", async (req, res) => {
  try {
    const inv = await Invoice.findById(req.params.id)
      .populate("lines.item")
      .populate("client")
      .lean();
    if (!inv) return res.status(404).json({ error: "Not found" });
    res.json(inv);
  } catch (err) {
    res.status(400).json({ error: "Bad request" });
  }
});

// update invoice
router.put("/:id", async (req, res) => {
  try {
    const { workName, client, from, date, total, items, notes } = req.body;

    const update = {
      workName,
      client,
      from,
      date,
      total,
      items,
      notes,
    };

    const inv = await Invoice.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    res.json(inv);
  } catch (err) {
    res.status(400).json({ error: "Failed to update invoice" });
  }
});

// delete invoice
router.delete("/:id", async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete invoice" });
  }
});

module.exports = router;
