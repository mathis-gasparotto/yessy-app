import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc } from 'firebase/firestore/lite'
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
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

// Get a list of simple bets from your database
export async function getSimpleBets() {
  const dataCol = collection(db, 'simple_bets')
  const docSnap = await getDocs(dataCol)
  const dataList = docSnap.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })
  return dataList
}

export async function getSimpleBet(id) {
  const docRef = doc(db, 'simple_bets', id)
  const docSnap = await getDocs(docRef)
  if (docSnap.exists()) {
    const item = docSnap.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data()
      }
    })
    return item
  } else {
    throw new Error('No such data!')
  }

}
