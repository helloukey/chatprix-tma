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

const getSnapshot = async (
  queryRef: CollectionReference<DocumentData, DocumentData>,
  userId: string,
  user: DocumentData,
  isFilter: boolean
) => {
  if (!isFilter) {
    const currentAge = user.dob
      ? new Date().getFullYear() - user.dob.toDate().getFullYear()
      : null;

    // Query 1: Users with filters field as null
    const query1 = query(
      queryRef,
      and(where(documentId(), "!=", userId), where("filters", "==", null))
    );

    // Query 2: Users with matching filters
    const conditions = [
      where(documentId(), "!=", userId),
      where("filters.gender", "in", ["", user.gender]),
      where("filters.country", "in", ["", user.country]),
    ];

    // Age condition
    if (currentAge !== null) {
      conditions.push(where("filters.minAge", "<=", currentAge));
      conditions.push(where("filters.maxAge", ">=", currentAge));
    } else {
      conditions.push(where("filters.minAge", ">=", 18));
      conditions.push(where("filters.maxAge", "<=", 99));
    }

    const query2 = query(queryRef, ...conditions);

    const snapshot1 = await getDocs(query1);
    if (!snapshot1.empty) {
      console.log("Snapshot 1: ", snapshot1);
      return snapshot1;
    }

    const snapshot2 = await getDocs(query2);
    return snapshot2;
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

    const query1 = query(queryRef, and(q1, q2, q3, q4, q5));
    const snapshot = await getDocs(query1);
    return snapshot;
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
    const querySnapshot = await getSnapshot(queuesRef, userId, user, isFilter);
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
