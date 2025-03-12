const { initializeApp } = require("firebase/app");

const { getDatabase, ref, set, get, child } = require("firebase/database");

const firebaseConfig = {
  apiKey: "AIzaSyA0hXc2BKY75Frf4duJuOWib2MMRgjz_dw",
  authDomain: "alertapp-3ebda.firebaseapp.com",
  projectId: "alertapp-3ebda",
  storageBucket: "alertapp-3ebda.appspot.com",
  messagingSenderId: "429899531177",
  appId: "1:429899531177:web:2e447551e85469f5bfbab8",
  databaseURL: "https://alertapp-3ebda-default-rtdb.firebaseio.com/"
};

const _ = initializeApp(firebaseConfig);
const db = getDatabase();
const dbRef = ref(db);

const saveToken = async (userId, token) => {
  const values = (await get(child(dbRef, `userTokens/${userId}`))).val() ?? {};
  const payload = { ...values, token };
  set(ref(db, `userTokens/${userId}/`), payload);
};

const getToken = async (userId) => {
  const values = await get(child(dbRef, `userTokens`));
  return values ?? {};
};

const saveSample = async (moistureLevel, userId) => {
  set(ref(db, `userTokens/${userId}/${Date.now().toString()}`), {
    moisture: moistureLevel,
  });
};

module.exports = { _, db, dbRef, saveToken, getToken, saveSample };