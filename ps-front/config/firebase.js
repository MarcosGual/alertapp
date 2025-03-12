import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "@firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAy0tvjenBkTmhdQlmArrujGxDYd4lu6EE",
  authDomain: "chat-app-542ee.firebaseapp.com",
  projectId: "chat-app-542ee",
  storageBucket: "chat-app-542ee.appspot.com",
  messagingSenderId: "11460511429",
  appId: "1:11460511429:web:5eac9189e5d060fd0b12ac",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const database = getFirestore();

const listFiles = async () => {
  const storage = getStorage();

  // Create a reference under which you want to list
  const listRef = ref(storage, "images");

  // Find all the prefixes and items.
  const listResp = await listAll(listRef);
  return listResp.items;
};

const uploadToFirebase = async (uri, name, onProgress) => {
  const fetchResponse = await fetch(uri);
  const theBlob = await fetchResponse.blob();

  const imageRef = ref(getStorage(), `images/${name}`);

  const uploadTask = uploadBytesResumable(imageRef, theBlob);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress && onProgress(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error);
        reject(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({
          downloadUrl,
          metadata: uploadTask.snapshot.metadata,
        });
      }
    );
  });
};

export { uploadToFirebase, listFiles };