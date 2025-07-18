const User = require("../models/User");

async function seedAdmin({ username, password }) {
  if (!username || !password) {
    console.log("[seedAdmin] Skipping seed: missing username/password.");
    return;
  }

  const existing = await User.findOne({ username });
  if (existing) {
    console.log(`[seedAdmin] Admin '${username}' already exists.`);
    return;
  }

  const user = new User({
    username,
    displayName: "Administrator",
    role: "admin",
  });
  await user.setPassword(password);
  await user.save();
  console.log(`[seedAdmin] Created admin user '${username}'.`);
}

module.exports = seedAdmin;
