import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export const googleAuth = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};

export const githubAuth = async () => {
  const provider = new GithubAuthProvider();
  return await signInWithPopup(auth, provider);
};
