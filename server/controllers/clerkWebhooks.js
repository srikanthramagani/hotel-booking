import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        // Verify webhook signature
        await whook.verify(JSON.stringify(req.body), headers);

        const { data, type } = req.body;

        console.log("Webhook Event Type:", type);
        console.log("Webhook Data:", data);

        // Fallback in case optional fields are missing
        const userData = {
            _id: data.id,
            email: data.email_addresses?.[0]?.email_address || "no-email@unknown.com",
            username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            image: data.image_url || "https://default-image.com/image.png",
            recentSearchCities: "defaultCity" // Placeholder if not provided
        };

        switch (type) {
            case "user.created": {
                await User.create(userData);
                console.log("User created:", userData._id);
                break;
            }

            case "user.updated": {
                await User.findByIdAndUpdate(data.id, userData, { new: true, upsert: true });
                console.log("User updated:", userData._id);
                break;
            }

            case "user.deleted": {
                await User.findByIdAndUpdate(data.id, { isDeleted: true });
                console.log("User soft deleted:", data.id);

                // Optional: for hard delete, use this instead
                // await User.findByIdAndDelete(data.id);
                break;
            }

            default:
                console.log("Unhandled event type:", type);
                break;
        }

        res.status(200).json({ success: true, message: "Webhook received and processed." });

    } catch (error) {
        console.error("Webhook error:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

export default clerkWebhooks;
