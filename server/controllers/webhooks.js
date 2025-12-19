import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

// API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
    await whook.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    })
    const { data, type } = JSON.parse(req.body)
    switch (type) {
      case 'user.created': {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        }
        await User.create(userData)
        res.json({})
        break;
      }
      case 'user.updated': {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,

        }
        await User.findByIdAndUpdate(data.id, userData)
        res.json({})
        break;
      }
      case 'user.deleted': {
        await User.findByIdAndDelete(data.id)
        res.json({})
        break;
      }



      default:
        res.json({ success: true, message: "Unhandled event type" })
        break;
    }
  } catch (error) {

    res.json({ success: false, message: error.message })
  }

}
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
export const stripeWebhooks = async (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;
  try {
    event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);


  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const { purchaseId } = session.metadata;

      const purchaseData = await Purchase.findById(purchaseId);
      if (!purchaseData) {
        console.error('Purchase not found:', purchaseId);
        break;
      }

      const userData = await User.findById(purchaseData.userId);
      const courseData = await Course.findById(purchaseData.courseId.toString());

      if (!userData || !courseData) {
        console.error('User or Course not found');
        break;
      }

      if (purchaseData.status === 'completed') {
        // Already processed, skip to avoid double counting
        break;
      }

      courseData.enrolledStudents.push(userData._id);
      await courseData.save();

      userData.enrolledCourses.push(courseData._id);
      await userData.save();

      purchaseData.status = 'completed';
      await purchaseData.save();

      // Affiliate Commission Credit
      if (purchaseData.affiliateId && purchaseData.commissionAmount > 0) {
        const affiliateUser = await User.findById(purchaseData.affiliateId);
        if (affiliateUser) {
          affiliateUser.affiliateEarnings += purchaseData.commissionAmount;
          await affiliateUser.save();
        }
      }

      break;
    }
    case 'checkout.session.expired': {
      const session = event.data.object;
      const { purchaseId } = session.metadata;
      const purchaseData = await Purchase.findById(purchaseId);
      if (purchaseData) {
        purchaseData.status = 'failed';
        await purchaseData.save();
      }
      break;
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
}
