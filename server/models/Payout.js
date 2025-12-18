import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
    {
        userId: { type: String, ref: "User", required: true },
        amount: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "processed", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export const Payout = mongoose.model("Payout", payoutSchema);
