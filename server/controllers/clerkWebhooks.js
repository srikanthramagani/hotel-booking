import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    // Create a Svix instance with the Clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Extract headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Check if headers are present
    if (!headers["svix-id"] || !headers["svix-timestamp"] || !headers["svix-signature"]) {
      return res.status(400).json({ success: false, message: "Missing Svix headers" });
    }

    // Verify the webhook signature
    const payload = JSON.stringify(req.body);
    await whook.verify(payload, headers);

    // Get data and event type
    const { data, type } = req.body;

    if (!data) {
      return res.status(400).json({ success: false, message: "Missing data in webhook" });
    }

    const email = data?.email_addresses?.[0]?.email_address || "";
    const firstName = data?.first_name || "";
    const lastName = data?.last_name || "";
    const image = data?.image_url || "";

    const userData = {
      _id: data.id,
      email,
      username: `${firstName} ${lastName}`.trim(),
      image,
    };

    // Switch case for different Clerk events
    switch (type) {
      case "user.created":
        await User.create(userData);
        break;
      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData, { new: true, upsert: true });
        break;
      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;
      default:
        console.log(`Unhandled webhook event type: ${type}`);
    }

    return res.status(200).json({ success: true, message: "Webhook received" });

  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
