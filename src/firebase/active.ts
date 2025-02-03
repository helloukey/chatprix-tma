import {
  collection,
  getDocs,
  or,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "./config";

const deleteActiveBatch = async (userId: string) => {
  try {
    const activeRef = collection(db, "active");
    const q = query(
      activeRef,
      or(where("user1", "==", userId), where("user2", "==", userId))
    );
    const batch = writeBatch(db);
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  } catch (error) {
    console.error("Error deleting active batch: ", error);
  }
};

export { deleteActiveBatch };
