/**
 * Firebase Cloud Functions Examples
 * 
 * These are minimal example functions to demonstrate the emulator setup.
 * Replace these with your own project-specific functions.
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

/**
 * Example HTTP Function
 * 
 * Trigger: HTTP request
 * Usage: POST http://localhost:5001/demo-project/us-central1/exampleHttpFunction
 * 
 * Example payload:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com"
 * }
 */
export const exampleHttpFunction = functions.https.onRequest(async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      res.status(400).json({ error: "Missing required fields: name, email" });
      return;
    }

    // Example: Create a document
    const docRef = await db.collection("users").add({
      name,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: "User created successfully",
      userId: docRef.id,
    });
  } catch (error) {
    console.error("Error in exampleHttpFunction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Example Firestore Trigger
 * 
 * Trigger: When a new order is created
 * Action: Update inventory and send notification
 * 
 * Replace with your own business logic
 */
export const onOrderCreated = functions.firestore
  .document("orders/{orderId}")
  .onCreate(async (snapshot, context) => {
    const order = snapshot.data();
    const orderId = context.params.orderId;

    try {
      console.log(`New order created: ${orderId}`, order);

      // Example: Update a counter
      await db.collection("config").doc("stats").set(
        {
          totalOrders: admin.firestore.FieldValue.increment(1),
          lastOrderAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      // Example: Create a notification document
      await db.collection("notifications").add({
        type: "order_created",
        orderId,
        userId: order.userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        read: false,
      });

      console.log(`Order ${orderId} processed successfully`);
    } catch (error) {
      console.error(`Error processing order ${orderId}:`, error);
    }
  });

/**
 * Example Scheduled Function
 * 
 * Trigger: Every day at midnight (UTC)
 * Action: Clean up old data
 * 
 * Note: Scheduled functions don't run in the emulator by default.
 * Test manually by calling the function or using the Firebase CLI.
 */
export const dailyCleanup = functions.pubsub
  .schedule("0 0 * * *")
  .timeZone("UTC")
  .onRun(async (context) => {
    try {
      console.log("Starting daily cleanup...");

      // Example: Delete old notifications (older than 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const oldNotifications = await db
        .collection("notifications")
        .where("createdAt", "<", thirtyDaysAgo)
        .get();

      const batch = db.batch();
      oldNotifications.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      console.log(`Deleted ${oldNotifications.size} old notifications`);
    } catch (error) {
      console.error("Error in daily cleanup:", error);
    }
  });

/**
 * Example User Validation Function
 * 
 * Trigger: When a user document is written
 * Action: Validate and sanitize user data
 */
export const validateUser = functions.firestore
  .document("users/{userId}")
  .onWrite(async (change, context) => {
    const after = change.after.exists ? change.after.data() : null;
    const before = change.before.exists ? change.before.data() : null;

    // Skip if document was deleted
    if (!after) {
      return null;
    }

    try {
      const updates: any = {};

      // Example validation: Ensure email is lowercase
      if (after.email && after.email !== after.email.toLowerCase()) {
        updates.email = after.email.toLowerCase();
      }

      // Example validation: Set default role if missing
      if (!after.role) {
        updates.role = "user";
      }

      // Example validation: Ensure createdAt exists
      if (!after.createdAt && !before) {
        updates.createdAt = admin.firestore.FieldValue.serverTimestamp();
      }

      // Apply updates if any
      if (Object.keys(updates).length > 0) {
        await change.after.ref.update(updates);
        console.log(`Updated user ${context.params.userId}:`, updates);
      }

      return null;
    } catch (error) {
      console.error(`Error validating user ${context.params.userId}:`, error);
      return null;
    }
  });

