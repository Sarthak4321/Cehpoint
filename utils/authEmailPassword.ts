import { auth } from "./firebase";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

export const firebaseSignup = async (email: string, password: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);

  // Send verification email (OTP link)
  await sendEmailVerification(result.user);

  return result;
};

export const firebaseLogin = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};
