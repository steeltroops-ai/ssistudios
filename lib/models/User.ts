import mongoose, { Document, Schema } from "mongoose";

// User interface extending Document for MongoDB
export interface IUser extends Document {
  username: string;
  email: string;
  password: string; // bcrypt hashed
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLoginAt?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  tokenVersion: number; // For refresh token invalidation
  rememberMe: boolean; // For extended session preference
  activeSessions: {
    sessionId: string;
    deviceInfo: string;
    ipAddress: string;
    userAgent: string;
    lastActivity: Date;
    expiresAt: Date;
  }[];
  oauthProviders: {
    google?: {
      id: string;
      email: string;
      verified: boolean;
    };
  };
  preferences: {
    theme: "light" | "dark" | "flower";
    notifications: boolean;
    language: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// User schema with comprehensive security and features
const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [2, "Username must be at least 2 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores, and hyphens",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    avatar: {
      type: String,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      select: false,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    rememberMe: {
      type: Boolean,
      default: false,
    },
    activeSessions: [
      {
        sessionId: {
          type: String,
          required: true,
        },
        deviceInfo: {
          type: String,
          required: true,
        },
        ipAddress: {
          type: String,
          required: true,
        },
        userAgent: {
          type: String,
          required: true,
        },
        lastActivity: {
          type: Date,
          default: Date.now,
        },
        expiresAt: {
          type: Date,
          required: true,
        },
      },
    ],
    oauthProviders: {
      google: {
        id: String,
        email: String,
        verified: { type: Boolean, default: false },
      },
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
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: "users", // Explicit collection name
  }
);

// Indexes for performance and security (email and username already indexed via unique: true)
UserSchema.index({ "oauthProviders.google.id": 1 });
UserSchema.index({ emailVerificationToken: 1 });
UserSchema.index({ passwordResetToken: 1 });
UserSchema.index({ lockUntil: 1 });
UserSchema.index({ lastLoginAt: 1 }); // For session management queries

// Virtual for full name
UserSchema.virtual("fullName").get(function () {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.lastName || this.username;
});

// Virtual for account lock status
UserSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil.getTime() > Date.now());
});

// Pre-save middleware for password hashing
UserSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    const bcrypt = require("bcryptjs");
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const bcrypt = require("bcryptjs");
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to increment login attempts
UserSchema.methods.incLoginAttempts = function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 },
    });
  }

  const updates: any = { $inc: { loginAttempts: 1 } };

  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }

  return this.updateOne(updates);
};

// Method to reset login attempts
UserSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
  });
};

// Method to add a new session
UserSchema.methods.addSession = function (sessionData: {
  sessionId: string;
  deviceInfo: string;
  ipAddress: string;
  userAgent: string;
  expiresAt: Date;
}) {
  // Remove expired sessions first
  this.activeSessions = this.activeSessions.filter(
    (session: any) => session.expiresAt > new Date()
  );

  // Add new session
  this.activeSessions.push({
    ...sessionData,
    lastActivity: new Date(),
  });

  return this.save();
};

// Method to update session activity
UserSchema.methods.updateSessionActivity = function (sessionId: string) {
  const session = this.activeSessions.find(
    (s: any) => s.sessionId === sessionId
  );
  if (session) {
    session.lastActivity = new Date();
    return this.save();
  }
  return Promise.resolve();
};

// Method to remove a session
UserSchema.methods.removeSession = function (sessionId: string) {
  this.activeSessions = this.activeSessions.filter(
    (session: any) => session.sessionId !== sessionId
  );
  return this.save();
};

// Method to clear all sessions (for logout all devices)
UserSchema.methods.clearAllSessions = function () {
  this.activeSessions = [];
  this.tokenVersion += 1; // Invalidate all refresh tokens
  return this.save();
};

// Method to clean expired sessions
UserSchema.methods.cleanExpiredSessions = function () {
  const now = new Date();
  this.activeSessions = this.activeSessions.filter(
    (session: any) => session.expiresAt > now
  );
  return this.save();
};

// Export the User model
export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
