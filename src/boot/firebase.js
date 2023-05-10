import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  deleteDoc
} from 'firebase/firestore/lite'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// export default db

/**********************************
 ***  Auth
 *********************************/
export async function signup(email, password) {
  const auth = getAuth(app)
  createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      // Signed in
      return userCredential.user
    }).catch((error) => {
      // const errorCode = error.code
      const errorMessage = error.message
      throw new Error(errorMessage)
    })
}
export async function login(email, password) {
  const auth = getAuth(app)
  signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      // Signed in
      return userCredential.user
    }).catch((error) => {
      // const errorCode = error.code
      const errorMessage = error.message
      throw new Error(errorMessage)
    })
}
export async function logout() {
  const auth = getAuth(app)
  auth.signOut().then(() => {
    return true
  }).catch((error) => {
    throw new Error(error.message)
  })
}

/**********************************
 ***  Bets
 *********************************/
export async function getBets() {
  const ref = collection(db, 'simple_bets')
  const snap = await getDocs(ref)
  const list = snap.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })
  return list
}
export async function getBet(id) {
  const ref = doc(db, 'simple_bets', id)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    return snap.data()
  } else {
    throw new Error('No such data!')
  }
}
export async function addBet(payload) {
  const ref = await addDoc(collection(db, 'simple_bets'), payload)
  return ref.id
}
export async function deleteBet(id) {
  await deleteDoc(doc(db, 'simple_bets', id))
}
