import {
  doc,
  DocumentData,
  getDoc,
  setDoc,
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
          filters: "",
        });
      }
    } else {
      setIsPro(false);
      if (data.filters) {
        await updateDoc(docRef, {
          filters: "",
        });
      }
    }
  } else {
    await setDoc(docRef, {
      username: generateUsername("", 0, 8),
      avatar: generateAvatar(),
      filters: "",
      pro: null,
      gender: "",
      dob: "",
      country: "",
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
      filters: "",
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export { checkAndUpdateUser, resetFilter };
