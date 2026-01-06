import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";
import { sendEmail } from "../configs/brevo.js";

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

      // Send Purchase Confirmation Email
      const purchaseSubject = "Course Purchase Confirmation";
      const purchaseContent = `<p>Hi ${userData.name},</p><p>Thank you for purchasing <strong>${courseData.courseTitle}</strong>. You can now access the course content.</p>`;
      try {
        await sendEmail(userData.email, purchaseSubject, purchaseContent);
      } catch (emailError) {
        console.error("Failed to send purchase email:", emailError);
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
