import {
  addDoc,
  and,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  documentId,
  getDocs,
  or,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "./config";

const updateQueue = async (user: DocumentData, userId: string) => {
  try {
    await setDoc(doc(db, "queues", userId), {
      user: user,
    });
    return true;
  } catch (error) {
    console.error("Error updating queue: ", error);
    return false;
  }
};

const findMatchFromQueue = async (userId: string, user: DocumentData) => {
  try {
    // Find a match from the queue
    const queuesRef = collection(db, "queues");
    const q = query(queuesRef, where(documentId(), "!=", userId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const match = querySnapshot.docs[0];
    if (!match.exists()) {
      return null;
    }

    // Match data
    const matchId = match.id;
    const matchData = match.data();

    // Remove match from queue
    const deleteQuery = query(
      queuesRef,
      or(where(documentId(), "==", userId), where(documentId(), "==", matchId))
    );
    const batch = writeBatch(db);
    const snapshot = await getDocs(deleteQuery);
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    // Check if match is already in chat
    const activeRef = collection(db, "active");
    const activeQuery = query(
      activeRef,
      and(
        or(where("user1", "==", userId), where("user2", "==", userId)),
        or(where("user1", "==", matchId), where("user2", "==", matchId))
      )
    );

    const activeSnapshot = await getDocs(activeQuery);
    if (!activeSnapshot.empty) {
      return activeSnapshot.docs[0].id;
    }

    // Check if single active chat exists for user
    const singleActiveQuery = query(
      activeRef,
      or(where("user1", "==", userId), where("user2", "==", userId))
    );
    const singleActiveSnapshot = await getDocs(singleActiveQuery);
    if (!singleActiveSnapshot.empty) {
      return singleActiveSnapshot.docs[0].id;
    }

    // Create a chat
    const chatDocument = await addDoc(activeRef, {
      user1: userId,
      user2: matchId,
      user1profile: user,
      user2profile: matchData.user,
      messages: [],
    });

    return chatDocument.id;
  } catch (error) {
    console.error("Error finding match: ", error);
    return null;
  }
};

const removeFromQueue = async (userId: string) => {
  try {
    await deleteDoc(doc(db, "queues", userId));
    return true;
  } catch (error) {
    console.error("Error removing from queue: ", error);
  }
};

export { updateQueue, findMatchFromQueue, removeFromQueue };
