const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    displayName: { type: String, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "admin" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// helper: set password
userSchema.methods.setPassword = async function (pw) {
  this.passwordHash = await bcrypt.hash(pw, 12);
};

// helper: validate password
userSchema.methods.validatePassword = function (pw) {
  return bcrypt.compare(pw, this.passwordHash);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
