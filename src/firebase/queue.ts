import {
  addDoc,
  and,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  documentId,
  getDocs,
  or,
  query,
  setDoc,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "./config";

const generateQuery = (
  queryRef: CollectionReference<DocumentData, DocumentData>,
  userId: string,
  user: DocumentData,
  isFilter: boolean
) => {
  if (!isFilter) {
    const currentAge = user?.dob
      ? new Date().getFullYear() - user.dob.toDate().getFullYear()
      : 0;
    const q1 = where(documentId(), "!=", userId);
    const q2 = where("filters", "==", null);
    const q3 = where("filters.gender", "==", "");
    const q4 = where("filters.gender", "==", user.gender);
    const q5 = where("filters.country", "==", "");
    const q6 = where("filters.country", "==", user.country);
    const q7 = user?.dob
      ? where("filters.minAge", "<=", currentAge)
      : where("filters.minAge", ">=", 18);
    const q8 = user?.dob
      ? where("filters.maxAge", ">=", currentAge)
      : where("filters.maxAge", "<=", 99);

    return query(
      queryRef,
      and(q1, or(q2, and(or(q3, q4), or(q5, q6), q7, q8)))
    );
  } else {
    const q1 = where(documentId(), "!=", userId);
    const q2 =
      user.filters.gender == ""
        ? where("gender", "in", ["male", "female", "other", ""])
        : where("gender", "==", user.filters.gender);
    const q3 =
      user.filters.country == ""
        ? where("country", "!=", "INVALID_VALUE")
        : where("country", "==", user.filters.country);
    const now = new Date();
    const minDOB = new Date(
      now.getFullYear() - user.filters.minAge,
      now.getMonth(),
      now.getDate()
    );
    const maxDOB = new Date(
      now.getFullYear() - user.filters.maxAge,
      now.getMonth(),
      now.getDate()
    );
    const q4 = where("dob", ">=", Timestamp.fromDate(minDOB));
    const q5 = where("dob", "<=", Timestamp.fromDate(maxDOB));

    return query(queryRef, and(q1, q2, q3, q4, q5));
  }
};

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
    // Check if single active chat exists for user
    const activeRef = collection(db, "active");
    const singleActiveQuery = query(
      activeRef,
      or(where("user1", "==", userId), where("user2", "==", userId))
    );
    const singleActiveSnapshot = await getDocs(singleActiveQuery);
    if (!singleActiveSnapshot.empty) {
      return singleActiveSnapshot.docs[0].id;
    }

    // Find a match from the queue
    const queuesRef = collection(db, "queues");
    const isFilter = user.filters ? true : false;
    const q = generateQuery(queuesRef, userId, user, isFilter);
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
