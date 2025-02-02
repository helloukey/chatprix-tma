import { doc, DocumentData, getDoc, setDoc } from "firebase/firestore";
import { db } from "./config";
import { generateUsername } from "unique-username-generator";
import { generateAvatar } from "@/lib/utils";

const checkAndUpdateUser = async (
  telegramId: number,
  setUser: DocumentData | null
) => {
  const id = telegramId.toString();
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // @ts-expect-error unknown type
    setUser(docSnap.data());
  } else {
    await setDoc(docRef, {
      username: generateUsername("", 0, 8),
      avatar: generateAvatar(),
    });
    const data = await getDoc(docRef);
    // @ts-expect-error unknown type
    setUser(data.data());
  }
};

export { checkAndUpdateUser };
