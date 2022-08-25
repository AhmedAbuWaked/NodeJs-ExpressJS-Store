const mongoose = require("mongoose");
const bcrybt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    phone: String,
    avatar: String,
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password is too short"],
    },
    passwordUpdatedAt: Date,
    role: {
      type: String,
      enum: ["user", "manager0", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  // Set Image Base URL + image name
  if (doc.avatar) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.avatar}`;
    doc.avatar = imageUrl;
  }
};

userSchema.post("init", setImageUrl);
userSchema.post("save", setImageUrl);

userSchema.pre("save", async function (next) {
  this.password = await bcrybt.hash(this.password, 12);

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
