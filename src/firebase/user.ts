import {
  doc,
  DocumentData,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./config";
import { generateUsername } from "unique-username-generator";
import { generateAvatar, isSubscriptionValid } from "@/lib/utils";

const checkAndUpdateUser = async (
  telegramId: number,
  setUser: (arg: DocumentData | null) => void,
  setUserId: (arg: string | null) => void,
  setIsPro: (arg: boolean) => void
) => {
  const id = telegramId.toString();
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    setUser(data);
    setUserId(id);
    if (data?.pro) {
      const isValid = isSubscriptionValid(
        data.pro.subscription_expiration_date
      );
      setIsPro(isValid);
      if (data.filters && !isValid) {
        await updateDoc(docRef, {
          filters: null,
        });
      }
    } else {
      setIsPro(false);
      if (data.filters) {
        await updateDoc(docRef, {
          filters: null,
        });
      }
    }
  } else {
    await setDoc(docRef, {
      username: generateUsername("", 0, 8),
      avatar: generateAvatar(),
      filters: null,
      pro: null,
      gender: "",
      dob: "",
      country: "",
      lastSeen: Timestamp.now(),
    });
    const data = await getDoc(docRef);
    if (data.exists()) {
      setUser(data.data());
      setUserId(id);
    }
  }
};

const resetFilter = async (isPro: boolean, userId: string) => {
  // Only allow non-pro users to reset filter
  if (isPro) return false;

  try {
    await updateDoc(doc(db, "users", userId), {
      filters: null,
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const updateUserLastSeen = async (userId: string) => {
  try {
    await updateDoc(doc(db, "queues", userId), {
      lastSeen: Timestamp.now(),
    });
  } catch (error) {
    console.error(error);
  }
};

export { checkAndUpdateUser, resetFilter, updateUserLastSeen };
