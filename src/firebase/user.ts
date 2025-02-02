import { doc, DocumentData, getDoc, setDoc } from "firebase/firestore";
import { db } from "./config";
import { generateUsername } from "unique-username-generator";
import { generateAvatar } from "@/lib/utils";

const checkAndUpdateUser = async (
  telegramId: number,
  setUser: (arg: DocumentData | null) => void,
  setUserId: (arg: string | null) => void
) => {
  const id = telegramId.toString();
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    setUser(docSnap.data());
    setUserId(id);
  } else {
    await setDoc(docRef, {
      username: generateUsername("", 0, 8),
      avatar: generateAvatar(),
    });
    const data = await getDoc(docRef);
    if (data.exists()) {
      setUser(data.data());
      setUserId(id);
    }
  }
};

export { checkAndUpdateUser };
