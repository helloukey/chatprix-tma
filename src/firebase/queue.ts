import {
  addDoc,
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

    // Create a chat
    const activeRef = collection(db, "active");
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
