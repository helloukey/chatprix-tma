import {initializeApp} from "firebase-admin/app";
import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {onSchedule} from "firebase-functions/scheduler";

initializeApp();

export const clearInactiveUsers = onSchedule("* * * * *", async () => {
  const db = getFirestore();
  const min = 60 * 1000;
  const oneMinuteAgo = Timestamp.fromMillis(Timestamp.now().toMillis() - min);

  try {
    // 1. Query inactive users in 'queues' collection
    const inactiveQueuesSnapshot = await db.collection("queues")
        .where("lastSeen", "<", oneMinuteAgo)
        .get();

    const user1InactiveSnapshot = await db.collection("chats")
        .where("user1profile.lastSeen", "<", oneMinuteAgo)
        .get();

    const user2InactiveSnapshot = await db.collection("chats")
        .where("user2profile.lastSeen", "<", oneMinuteAgo)
        .get();

    // Merge unique chat documents (avoid duplicate deletions)
    const inactiveChatsDocs = new Set([
      ...user1InactiveSnapshot.docs.map((doc) => doc.ref),
      ...user2InactiveSnapshot.docs.map((doc) => doc.ref),
    ]);

    // Delete all inactive users from 'queues' and 'chats'
    const batch = db.batch();

    inactiveQueuesSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
    inactiveChatsDocs.forEach((ref) => batch.delete(ref));

    if (!inactiveQueuesSnapshot.empty || inactiveChatsDocs.size > 0) {
      await batch.commit();
      console.log(`Deleted ${inactiveQueuesSnapshot.size} inactive users.`);
    } else {
      console.log("No inactive users found.");
    }
  } catch (error) {
    console.error("Error clearing inactive users:", error);
  }
});
