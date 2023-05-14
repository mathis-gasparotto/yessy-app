import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  setDoc,
  query,
  where
} from 'firebase/firestore/lite'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth'
import createFormat from '../stores/formatting.js'
import { LocalStorage } from 'quasar'

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
export async function signup(
  email,
  password,
  username,
  birthday,
  referralCode,
  newsletter
) {
  const q = query(collection(db, 'users_data'), where('username', '==', username))
  const querySnapshot = await getDocs(q)
  if (querySnapshot.size > 0) {
    throw new Error('Nom d\'utilisateur déjà utilisé')
  }
  const auth = getAuth(app)
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const payload = {
        email: userCredential.user.email,
        username,
        birthday: createFormat().dateTimeFormatToBDD(birthday),
        newsletter
      }
      referralCode ? (payload.referralCode = referralCode) : null
      return addUser(userCredential.user.uid, payload)
        .then((res) => {
          LocalStorage.set('token', userCredential.user.refreshToken)
          LocalStorage.set('user', {
            ...payload,
            lastLoginAt: new Date(
              parseInt(userCredential.user.metadata.lastLoginAt)
            ),
            birthday: new Date(res.birthday.seconds * 1000),
            createdAt: new Date(res.createdAt.seconds * 1000),
            updatedAt: new Date(res.updatedAt.seconds * 1000),
            uid: userCredential.user.uid
          })
        })
        .catch((error) => {
          throw new Error(error.message)
        })
    })
    .catch((error) => {
      throw new Error(error.message)
    })
}
export function login(email, password) {
  const auth = getAuth(app)
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      return getUser(userCredential.user.uid)
        .then((res) => {
          LocalStorage.set('token', userCredential.user.refreshToken)
          LocalStorage.set('user', {
            ...res,
            lastLoginAt: new Date(
              parseInt(userCredential.user.metadata.lastLoginAt)
            ),
            birthday: new Date(res.birthday.seconds * 1000),
            createdAt: new Date(res.createdAt.seconds * 1000),
            updatedAt: new Date(res.updatedAt.seconds * 1000),
            uid: userCredential.user.uid
          })
        })
        .catch((error) => {
          throw new Error(error.message)
        })
    })
    .catch((error) => {
      const errorMessage = error.message
      throw new Error(errorMessage)
    })
}
export function logout() {
  const auth = getAuth(app)
  return auth
    .signOut()
    .then(() => {
      LocalStorage.remove('token')
      LocalStorage.remove('user')
    })
    .catch((error) => {
      throw new Error(error.message)
    })
}

/**********************************
 ***  Users
 *********************************/
export async function getUser(uid) {
  const refUser = doc(db, 'users', uid)
  const snapUser = await getDoc(refUser)
  const refUserData = doc(db, 'users_data', uid)
  const snapUserData = await getDoc(refUserData)
  if (snapUserData.exists() && snapUser.exists()) {
    return {
      ...snapUserData.data(),
      ...snapUser.data(),
      uid,
      birthday: new Date(snapUserData.data().birthday.seconds * 1000),
      createdAt: new Date(snapUserData.data().createdAt.seconds * 1000),
      updatedAt: new Date(snapUserData.data().updatedAt.seconds * 1000)
    }
  } else {
    throw new Error('No such data!')
  }
}
export function addUser(uid, payload) {
  payload = {
    ...payload,
    private: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  return setDoc(doc(db, 'users_data', uid), payload).then(() => {
    return payload
  }).catch((error) => {
    throw new Error(error.message)
  })
}
export function updateUser(uid, payload) {
  payload = {
    ...payload,
    updatedAt: new Date()
  }
  return setDoc(doc(db, 'users_data', uid), payload, { merge: true }).then(() => {
    return payload
  }).catch((error) => {
    throw new Error(error.message)
  })
}
export async function updateUserName(uid, username) {
  const q = query(collection(db, 'users_data'), where('username', '==', username))
  const querySnapshot = await getDocs(q)
  if (querySnapshot.size > 0) {
    throw new Error('Nom d\'utilisateur déjà utilisé')
  }
  const payload = {
    username,
    updatedAt: new Date()
  }
  return setDoc(doc(db, 'users_data', uid), payload, { merge: true }).then(() => {
    return payload
  }).catch((error) => {
    throw new Error(error.message)
  })
}
export function deleteUserData(id) {
  return deleteDoc(doc(db, 'users_data', id))
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
export function addBet(payload) {
  return addDoc(collection(db, 'simple_bets'), {
    ...payload,
    authorId: LocalStorage.getItem('user').uid
  }).then((ref) => {
    return {
      id: ref.id,
      ...payload,
      authorId: LocalStorage.getItem('user').uid
    }
  }).catch((error) => {
    throw new Error(error.message)
  })
}
export function deleteBet(id) {
  return deleteDoc(doc(db, 'simple_bets', id))
}

/**********************************
 ***  Avatars
 *********************************/
export async function getAvatars() {
  const ref = collection(db, 'avatars')
  const snap = await getDocs(ref)
  const list = snap.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })
  return list
}
export async function getAvatar(id) {
  const ref = doc(db, 'avatars', id)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    return snap.data()
  } else {
    throw new Error('No such data!')
  }
}
export function addAvatar(payload) {
  return addDoc(collection(db, 'avatars'), {
    ...payload,
    authorId: LocalStorage.getItem('user').uid
  }).then((ref) => {
    return {
      id: ref.id,
      ...payload,
      authorId: LocalStorage.getItem('user').uid
    }
  }).catch((error) => {
    throw new Error(error.message)
  })
}
export function deleteAvatar(id) {
  return deleteDoc(doc(db, 'avatars', id))
}
