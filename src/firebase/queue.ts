import { deleteDoc, doc, DocumentData, setDoc } from "firebase/firestore";
import { db } from "./config";

const updateQueue = async (user: DocumentData, userId: string) => {
  try {
    await deleteDoc(doc(db, "queues", userId));
    await setDoc(doc(db, "queues", userId), {
      user: user,
    });
    return true;
  } catch (error) {
    console.error("Error updating queue: ", error);
    return false;
  }
};

export { updateQueue };
