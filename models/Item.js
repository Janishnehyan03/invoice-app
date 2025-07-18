const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true }, // base price
    sgst: { type: Number, default: 0 }, // GST percentage
    cgst: { type: Number, default: 0 }, // GST percentage
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
