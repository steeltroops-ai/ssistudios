// Script to create a test user for authentication testing
// Set environment variables manually
process.env.MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://puneetshukla041:zo6KoEIWALNm9d97@cluster0.lmeiugu.mongodb.net/employeeaccess?retryWrites=true&w=majority&appName=Cluster0";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User schema (simplified version for testing)
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: String,
    lastName: String,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark", "flower"],
        default: "light",
      },
      notifications: {
        type: Boolean,
        default: true,
      },
      language: {
        type: String,
        default: "en",
      },
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// Pre-save middleware for password hashing
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", UserSchema);

async function createTestUser() {
  try {
    console.log("🔗 Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to database");

    // Check if test user already exists
    const existingUser = await User.findOne({ username: "testuser" });
    if (existingUser) {
      console.log("⚠️  Test user already exists, deleting...");
      await User.deleteOne({ username: "testuser" });
    }

    // Create test user
    console.log("👤 Creating test user...");
    const testUser = new User({
      username: "testuser",
      email: "test@ssistudios.com",
      password: "password123", // Will be hashed by pre-save middleware
      firstName: "Test",
      lastName: "User",
      preferences: {
        theme: "light",
        notifications: true,
        language: "en",
      },
    });

    await testUser.save();
    console.log("✅ Test user created successfully!");
    console.log("📋 Test user details:");
    console.log("   Username: testuser");
    console.log("   Email: test@ssistudios.com");
    console.log("   Password: password123");
    console.log("   ID:", testUser._id);

    // Test password verification
    console.log("\n🔐 Testing password verification...");
    const isPasswordValid = await testUser.comparePassword("password123");
    console.log(
      "Password verification:",
      isPasswordValid ? "✅ PASS" : "❌ FAIL"
    );

    const isWrongPassword = await testUser.comparePassword("wrongpassword");
    console.log(
      "Wrong password verification:",
      isWrongPassword ? "❌ FAIL" : "✅ PASS"
    );

    await mongoose.disconnect();
    console.log("\n🎉 Test user setup completed!");
    console.log("\nYou can now test login with:");
    console.log("Username: testuser");
    console.log("Password: password123");
  } catch (error) {
    console.error("❌ Error creating test user:", error);
    process.exit(1);
  }
}

createTestUser();
