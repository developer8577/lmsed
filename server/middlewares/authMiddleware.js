import { clerkClient } from "@clerk/clerk-sdk-node";
import User from "../models/User.js";

// Protect User Routes
export const protectUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.json({ success: false, message: "Not authorized. Login Again." });
        }

        const decoded = await clerkClient.verifyToken(token);
        const clerkUserId = decoded.sub;

        req.auth = { clerkId: clerkUserId };

        const user = await User.findOne({ clerkId: clerkUserId });
        if (user) {
            req.auth.userId = user._id;
        } else if (req.path.includes('/sync')) {
            // Allow sync endpoint to proceed without existing user
            // req.auth.userId is undefined here, syncUser will handle it
        } else {
            return res.json({ success: false, message: "User not synced. Please refresh." });
        }

        next();

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Protect Educator Routes
export const protectEducator = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.json({ success: false, message: "Not authorized. Login Again." });
        }

        const decoded = await clerkClient.verifyToken(token);
        const clerkUserId = decoded.sub;

        const user = await User.findOne({ clerkId: clerkUserId });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        req.auth = { userId: user._id, clerkId: clerkUserId };

        if (user.role !== 'educator') {
            return res.json({ success: false, message: "Not authorized. Educator Access Required." });
        }

        next();

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}
