import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { DEV } from ".";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = initializeApp(config, "client");

export const database = getFirestore(app);
export const auth = getAuth(app);

class Tweeward {
  address: string;
  collection: CollectionReference<DocumentData>;
  path: string = DEV ? "tweeward-dev" : "tweeward";
  constructor(address: string) {
    this.address = address;
    this.collection = collection(database, this.path);
  }

  async getStats() {
    let stats;
    (await getDocs(this.collection)).docs.forEach((doc) => {
      stats = doc.data();
    });
    return stats;
  }

  async getStat(path = "") {
    return await getDoc(
      doc(this.collection, path ? `${this.address}/${path}` : this.address)
    );
  }

  async removeStat(id: string) {
    let stats: any = [];
    (await getDocs(this.collection)).docs.forEach((doc) => {
      stats = doc.data();
    });
    // console.log(
    //   Object.keys(stats)
    //     .filter((_id) => _id !== id)
    //     .reduce((obj: any, id) => {
    //       obj[id] = stats[id];
    //       return obj;
    //     }, {})
    // );
    return await setDoc(
      doc(this.collection, this.address),
      Object.keys(stats)
        .filter((_id) => _id !== id)
        .reduce((obj: any, id) => {
          obj[id] = stats[id];
          return obj;
        }, {})
    );
  }

  async addOrUpdateTweetStats(data: any, path = "") {
    return await setDoc(
      doc(this.collection, path ? `${this.address}/${path}` : this.address),
      data,
      { merge: true }
    );
  }
}

export { addDoc, getDocs, getDoc, doc, collection, setDoc, Tweeward };
