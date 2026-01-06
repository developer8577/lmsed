import User from '../models/User.js';
import { clerkClient } from "@clerk/clerk-sdk-node";

// Sync User with Clerk
export const syncUser = async (req, res) => {
    try {
        const { clerkId } = req.auth;

        // 1. If middleware already found user, return it
        if (req.auth.userId) {
            const user = await User.findById(req.auth.userId);
            return res.json({ success: true, user });
        }

        // 2. Fetch details from Clerk
        const clerkUser = await clerkClient.users.getUser(clerkId);
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        const name = clerkUser.firstName + (clerkUser.lastName ? ` ${clerkUser.lastName}` : '');
        const imageUrl = clerkUser.imageUrl;

        // 3. Check for Legacy User (by Email)
        const existingLegacyUser = await User.findOne({ email });

        if (existingLegacyUser) {
            // LINK ACCOUNTS: Update legacy user with Clerk ID
            existingLegacyUser.clerkId = clerkId;
            existingLegacyUser.imageUrl = imageUrl; // optional update
            await existingLegacyUser.save();
            return res.json({ success: true, user: existingLegacyUser });
        }

        // 4. Create New User
        const newUser = await User.create({
            clerkId,
            name,
            email,
            imageUrl,
            role: 'student',
            _id: clerkId // OPTIONAL: We CAN use clerkId as _id for new users to prevent ObjectId confusion, or just let Mongo do it. 
            // To be safe and consistent with "String" _id defined in schema, let's use clerkId if possible, 
            // OR standard ObjectId string.
            // User Schema says `_id: { type: String, required: true }`.
            // Let's use `clerkId` as `_id` for NEW users. Matches original plan.
        });

        return res.json({ success: true, user: newUser });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Get User Data (Protected)
export const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.auth.userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
