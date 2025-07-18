const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      // Good practice to avoid duplicate invoice numbers
      trim: true,
    },
    from: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      fromAddress: {
        type: String,
        required: true,
        trim: true,
      },
      fromMobile: {
        type: String,
        required: true,
        trim: true,
      },
      fromGSTIN: {
        type: String,
        required: true,
        trim: true,
      },
    },

    to: {
      type: String,
      required: true,
      trim: true,
    },
    workName: { type: String, required: true, trim: true },
    date: { type: Date, required: true, default: Date.now },
    items: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        qty: {
          type: Number,
          required: true,
          min: 1,
        },
        sgst: { type: Number, default: 0 },
        cgst: { type: Number, default: 0 },
      },
    ],
    total: { type: Number, required: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Pre-save hook to calculate the total before saving the document
invoiceSchema.pre("save", function (next) {
  this.total = this.items.reduce((sum, item) => sum + item.qty * item.price, 0);
  next();
});

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
