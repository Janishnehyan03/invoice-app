const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// Get all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ name: 1 });
    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Create a new item
router.post("/", async (req, res) => {
  const { name, price, sgst, cgst } = req.body;
  try {
    const newItem = new Item({ name, price, sgst, cgst });
    await newItem.save();
    res.status(201).json({ item: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create item." });
  }
});

// Update an item
router.put("/:id", async (req, res) => {
  try {
    console.log("Updating item with ID:", req.params.id);
    console.log("Update data:", req.body);
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ item: updatedItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update item." });
  }
});

// Delete an item
router.delete("/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Item deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete item." });
  }
});

module.exports = router;
