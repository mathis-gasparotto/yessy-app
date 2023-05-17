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
  where,
  updateDoc
} from 'firebase/firestore/lite'
import { getCountFromServer } from 'firebase/firestore'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  updateCurrentUser
} from 'firebase/auth'
import createFormat from '../stores/formatting.js'
// import { LocalStorage } from 'quasar'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
}

export const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
export const auth = getAuth(app)

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
  const q = query(collection(db, 'users'), where('username', '==', username.trim()))
  const querySnapshot = await getDocs(q)
  if (querySnapshot.size > 0) {
    throw new Error('Nom d\'utilisateur déjà utilisé')
  }
  return setPersistence(auth, browserLocalPersistence).then(() => {
      return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const payload = {
            email: userCredential.user.email.trim(),
            password: password.trim(),
            birthday: createFormat().dateTimeFormatToBDD(birthday),
            newsletter
          }
          referralCode ? (payload.referralCode = referralCode.trim()) : null
          return addUser(userCredential.user.uid, payload, username.trim())
            // .then((res) => {
            //   LocalStorage.set('token', userCredential.user.refreshToken)
            //   LocalStorage.set('user', {
            //     ...payload,
            //     lastLoginAt: new Date(
            //       parseInt(userCredential.user.metadata.lastLoginAt)
            //     ),
            //     birthday: new Date(res.birthday.seconds * 1000),
            //     createdAt: new Date(res.createdAt.seconds * 1000),
            //     updatedAt: new Date(res.updatedAt.seconds * 1000),
            //     uid: userCredential.user.uid
            //   })
            // })
            .catch((error) => {
              throw new Error(error.message)
            })
        })
        .catch((error) => {
          throw new Error(error.message)
        })
    }).catch((error) => {
      throw new Error(error.message)
    })
}
export function login(email, password) {
  return setPersistence(auth, browserLocalPersistence).then(() => {
      return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          return getUser(userCredential.user.uid)
            // .then((res) => {
            //   LocalStorage.set('token', userCredential.user.refreshToken)
            //   LocalStorage.set('user', {
            //     ...res,
            //     lastLoginAt: new Date(
            //       parseInt(userCredential.user.metadata.lastLoginAt)
            //     ),
            //     birthday: new Date(res.birthday.seconds * 1000),
            //     createdAt: new Date(res.createdAt.seconds * 1000),
            //     updatedAt: new Date(res.updatedAt.seconds * 1000),
            //     uid: userCredential.user.uid
            //   })
            // })
            .catch((error) => {
              throw new Error(error.message)
            })
        })
        .catch((error) => {
          throw new Error(error.message)
        })
    }).catch((error) => {
      throw new Error(error.message)
    })
}
export function logout() {
  const auth = getAuth(app)
  return auth
    .signOut()
    // .then(() => {
    //   LocalStorage.remove('token')
    //   LocalStorage.remove('user')
    // })
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
    const avatar = await getAvatar(snapUser.data().avatar.id).then((res) => {
      return res
    }).catch((error) => {
      throw new Error(error.message)
    })
    return {
      ...snapUserData.data(),
      ...snapUser.data(),
      uid,
      birthday: new Date(snapUserData.data().birthday.seconds * 1000),
      createdAt: new Date(snapUserData.data().createdAt.seconds * 1000),
      updatedAt: new Date(snapUserData.data().updatedAt.seconds * 1000),
      avatar
    }
  } else {
    throw new Error('No such data!')
  }
}
export function addUser(uid, payload, username) {
  payload = {
    ...payload,
    private: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  const toReturn = {
    ...payload,
    uid,
    username
  }
  return setDoc(doc(db, 'users_data', uid), payload).then(() => {
    return setDoc(doc(db, 'users', uid), {username, avatar: doc(db, 'avatars', process.env.DEFAULT_AVATAR_ID)}).then(() => {
      return toReturn
    }).catch((error) => {
      throw new Error(error.message)
    })
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
  const q = query(collection(db, 'users'), where('username', '==', username.trim()))
  const querySnapshot = await getDocs(q)
  if (querySnapshot.size > 0) {
    throw new Error('Nom d\'utilisateur déjà utilisé')
  }
  const payload = {
    username : username.trim(),
    updatedAt: new Date()
  }
  return updateDoc(doc(db, 'users', uid), payload).then(() => {
    return payload
  }).catch((error) => {
    throw new Error(error.message)
  })
}
export async function deleteUserData() {
  await updateCurrentUser(auth, {disabled: true})
  return deleteDoc(doc(db, 'users_data', auth.currentUser.uid))
}

/**********************************
 ***  Bets
 *********************************/
export async function getBets() {
  const ref = query(collection(db, 'simple_bets'), where('privacy', '==', 'public'))
  const snap = await getDocs(ref)
  const list = await snap.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })
  list.forEach(async (bet) => {
    const author = await getUser(bet.author.id).then((res) => {
      return res
    }).catch((error) => {
      throw new Error(error.message)
    })
    bet.author = author
    const category = await getBetCategory(bet.category.id).then((res) => {
      return res
    }).catch((error) => {
      throw new Error(error.message)
    })
    bet.category = category
  })
  return list
}
export async function getBet(id) {
  const ref = doc(db, 'simple_bets', id)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    const author = await getUser(snap.data().author.id).then((res) => {
      return res
    }).catch((error) => {
      throw new Error(error.message)
    })
    const category = await getBetCategory(snap.data().category.id).then((res) => {
      return res
    }).catch((error) => {
      throw new Error(error.message)
    })
    return {
      id: snap.id,
      ...snap.data(),
      author,
      category
    }
  } else {
    throw new Error('No such data!')
  }
}
export function addBet(payload, categoryId) {
  return addDoc(collection(db, 'simple_bets'), {
    ...payload,
    category: doc(db, 'bet_categories', categoryId),
    author: doc(db, 'users', auth.currentUser.uid)
    // authorId: LocalStorage.getItem('user').uid
  }).then((ref) => {
    return {
      id: ref.id,
      ...payload,
      category: doc(db, 'bet_categories', categoryId),
      author: doc(db, 'users', auth.currentUser.uid)
      // authorId: LocalStorage.getItem('user').uid
    }
  }).catch((error) => {
    throw new Error(error.message)
  })
}
export async function deleteBet(id) {
  const ref = doc(db, 'simple_bets', id)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    if (snap.data().author.id === auth.currentUser.uid) {
      return deleteDoc(doc(db, 'simple_bets', id))
    } else {
      throw new Error('Vous ne pouvez pas supprimer ce pari')
    }
  } else {
    throw new Error('No such data!')
  }
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
    return {
      id: snap.id,
      ...snap.data()
    }
  } else {
    throw new Error('No such data!')
  }
}

/**********************************
 ***  Bet Categories
 *********************************/
export async function getBetCategories() {
  const ref = collection(db, 'bet_categories')
  const snap = await getDocs(ref)
  const list = snap.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })
  return list
}
export async function getBetCategory(id) {
  const ref = doc(db, 'bet_categories', id)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    return {
      id: snap.id,
      ...snap.data()
    }
  } else {
    throw new Error('No such data!')
  }
}

/**********************************
 ***  Participations
 *********************************/
 export async function getMyParticipations() {
  const ref = query(collection(db, 'participations'), where('user', '==', doc(db, 'users', auth.currentUser.uid)))
  const snap = await getDocs(ref)
  console.log(snap.docs.data())
  const list = await snap.docs.map(async (doc) => {
    let bet = await getBet(doc.data().bet.id).then((res) => {
      return res
    }).catch((error) => {
      throw new Error(error.message)
    })
    return {
      participationId: doc.id,
      ...bet
    }
  })
  return list
}
export async function getParticipationCount(betId) {
  const ref = query(collection(db, 'participations'), where('bet.id', '==', betId))
  const snap = await getCountFromServer(ref)
  return snap.data().count
}
export async function participate(betId) {
  const ref = query(collection(db, 'participations'), where('user', '==', doc(db, 'users', auth.currentUser.uid)), where('bet', '==', doc(db, 'simple_bets', betId)))
  // const count = console.log(await getCountFromServer(ref))
  const snap = await getDocs(ref)
  if (snap.docs.length > 0) {
    throw new Error('Vous participez déjà à ce pari')
  } else {
    return addDoc(collection(db, 'participations'), {
      user: doc(db, 'users', auth.currentUser.uid),
      bet: doc(db, 'simple_bets', betId)
    }).catch((error) => {
      throw new Error(error.message)
    })
  }
}
export function deleteParticipation(id) {
  return deleteDoc(doc(db, 'participations', id))
}
