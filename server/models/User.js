import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // For custom auth
    imageUrl: { type: String, default: "https://via.placeholder.com/150" },
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: 'student' },
    enrolledCourses: [
      {
        type: String,
        ref: 'Course',
      },
    ],
    affiliateEarnings: { type: Number, default: 0 },
    affiliateCode: { type: String, unique: true, sparse: true },
    clerkId: { type: String, unique: true, sparse: true, index: true },
  },
  { timestamps: true }
);
const User = mongoose.model('User', userSchema);

export default User
