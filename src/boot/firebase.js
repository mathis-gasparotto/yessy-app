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
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  deleteUser
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
export async function signup(email, password, username, birthday, referralCode, newsletter) {
  const q = query(collection(db, 'users'), where('username', '==', username.trim()))
  const querySnapshot = await getDocs(q)
  if (querySnapshot.size > 0) {
    throw new Error("Nom d'utilisateur déjà utilisé")
  }
  return setPersistence(auth, browserLocalPersistence)
    .then(() => {
      return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const payload = {
            email: userCredential.user.email.trim(),
            birthday: createFormat().dateTimeFormatToBDD(birthday),
            newsletter,
            referralCode: referralCode ? referralCode.trim() : ''
          }
          return (
            addUser(userCredential.user.uid, payload, username.trim())
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
          )
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
  return setPersistence(auth, browserLocalPersistence)
    .then(() => {
      return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          return (
            getUser(userCredential.user.uid)
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
          )
        })
        .catch((error) => {
          throw new Error(error.message)
        })
    })
    .catch((error) => {
      throw new Error(error.message)
    })
}
export function logout() {
  const auth = getAuth(app)
  return (
    auth
      .signOut()
      // .then(() => {
      //   LocalStorage.remove('token')
      //   LocalStorage.remove('user')
      // })
      .catch((error) => {
        throw new Error(error.message)
      })
  )
}

/**********************************
 ***  Users
 *********************************/
export async function getUser(uid) {
  const refUser = doc(db, 'users', uid)
  const snapUser = await getDoc(refUser)
  if (snapUser.exists()) {
    const snapUserData = await getDoc(doc(db, 'users_data', snapUser.id))
    if (snapUserData.exists()) {
      const avatar = await getDoc(snapUser.data().avatar)
      return {
        ...snapUserData.data(),
        ...snapUser.data(),
        uid: snapUser.id,
        birthday: new Date(snapUserData.data().birthday.seconds * 1000),
        createdAt: new Date(snapUserData.data().createdAt.seconds * 1000),
        updatedAt: new Date(snapUserData.data().updatedAt.seconds * 1000),
        avatar: avatar.data()
      }
    } else {
      throw new Error('No such data!')
    }
  } else {
    throw new Error('No such data!')
  }
}
export async function getUserWithDoc(ref) {
  const snapUser = await getDoc(ref)
  if (snapUser.exists()) {
    const snapUserData = await getDoc(doc(db, 'users_data', snapUser.id))
    if (snapUserData.exists()) {
      const avatar = await getDoc(snapUser.data().avatar)
      return {
        ...snapUserData.data(),
        ...snapUser.data(),
        uid: snapUser.id,
        birthday: new Date(snapUserData.data().birthday.seconds * 1000),
        createdAt: new Date(snapUserData.data().createdAt.seconds * 1000),
        updatedAt: new Date(snapUserData.data().updatedAt.seconds * 1000),
        avatar: avatar.data()
      }
    } else {
      throw new Error('No such data!')
    }
  } else {
    throw new Error('No such data!')
  }
}
export function addUser(uid, payload, username) {
  payload = {
    ...payload,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  const toReturn = {
    ...payload,
    private: false,
    winMultiplier: 1,
    uid,
    username
  }
  return setDoc(doc(db, 'users_data', uid), {
    birthday: payload.birthday,
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt
  })
    .then(() => {
      return setDoc(doc(db, 'users', uid), {
        username,
        avatar: doc(db, 'avatars', process.env.DEFAULT_AVATAR_ID),
        referralCode: payload.referralCode,
        newsletter: payload.newsletter,
        disabled: false,
        private: false,
        winMultiplier: 1,
        createdAt: payload.createdAt,
        updatedAt: payload.updatedAt
      })
        .then(() => {
          return toReturn
        })
        .catch((error) => {
          throw new Error(error.message)
        })
    })
    .catch((error) => {
      throw new Error(error.message)
    })
}
export function updateUserData(uid, payload) {
  payload = {
    ...payload,
    updatedAt: new Date()
  }
  return updateDoc(doc(db, 'users_data', uid), payload)
    .then(() => {
      return payload
    })
    .catch((error) => {
      throw new Error(error.message)
    })
}
export function updateUser(uid, payload) {
  return updateDoc(doc(db, 'users', uid), payload)
    .then(() => {
      return payload
    })
    .catch((error) => {
      throw new Error(error.message)
    })
}
export async function updateUserName(uid, username) {
  const q = query(collection(db, 'users'), where('username', '==', username.trim()), where('disabled', '==', false))
  const querySnapshot = await getDocs(q)
  if (querySnapshot.size > 0) {
    throw new Error("Nom d'utilisateur déjà utilisé")
  }
  const payload = {
    username: username.trim(),
    updatedAt: new Date()
  }
  return updateDoc(doc(db, 'users', uid), payload)
    .then(() => {
      return payload
    })
    .catch((error) => {
      throw new Error(error.message)
    })
}
export async function deleteUserData() {
  await updateDoc(doc(db, 'users', auth.currentUser.uid), {
    disabled: true
  }).catch((error) => {
    throw new Error(error.message)
  })
  await deleteMyParticipations().catch((error) => {
    throw new Error(error.message)
  })
  await deleteDoc(doc(db, 'users_data', auth.currentUser.uid)).catch((error) => {
    throw new Error(error.message)
  })
  await deleteUser(auth.currentUser).catch((error) => {
    throw new Error(error.message)
  })
}

/**********************************
 ***  Bets
 *********************************/
export async function getBets(type = 'all', privacy = 'public') {
  const now = new Date()
  const conditions = [where('privacy', '==', privacy), where('disabled', '==', false)]
  if (type === 'future') {
    conditions.push(where('startAt', '>', now))
  } else if (type === 'active') {
    conditions.push(
      where('startAt', '<=', now)
      // where('endAt', '>', now)
    )
  } else if (type === 'ended') {
    conditions.push(where('endAt', '<=', now))
  }
  const ref = query(collection(db, 'simple_bets'), ...conditions)
  let snap = await getDocs(ref)
  // if (type === 'active') {
  //   snap.docs = snap.docs.filter((item) => new Date(item.data().endAt.seconds * 1000) > now)
  // }
  const list = await snap.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })
  list.forEach(async (bet) => {
    const author = await getUserWithDoc(bet.author)
      .then((res) => {
        return res
      })
      .catch((error) => {
        return {
          username: 'Utilisateur supprimé',
          avatar: {
            url: process.env.DEFAULT_AVATAR_URL
          }
        }
      })
    bet.author = author
    const category = await getBetCategoryWithDoc(bet.category)
      .then((res) => {
        return res
      })
      .catch((error) => {
        throw new Error(error.message)
      })
    bet.category = category
  })
  if (type === 'active') {
    return list.filter((item) => new Date(item.endAt.seconds * 1000) > now)
  }
  return Promise.all(list)
}
export async function getBet(id) {
  const ref = doc(db, 'simple_bets', id)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    const author = await getUserWithDoc(snap.data().author).catch(() => {
      return {
        username: 'Utilisateur supprimé',
        avatar: {
          url: process.env.DEFAULT_AVATAR_URL
        }
      }
    })
    const category = await getBetCategoryWithDoc(snap.data().category)
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
export async function getBetWithDoc(ref) {
  const snap = await getDoc(ref)
  if (snap.exists()) {
    const author = await getUserWithDoc(snap.data().author)
    const category = await getBetCategoryWithDoc(snap.data().category)
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
    author: doc(db, 'users', auth.currentUser.uid),
    disabled: false,
    winnerChoice: null
    // authorId: LocalStorage.getItem('user').uid
  })
    .then((ref) => {
      return {
        id: ref.id,
        ...payload,
        category: doc(db, 'bet_categories', categoryId),
        author: doc(db, 'users', auth.currentUser.uid)
        // authorId: LocalStorage.getItem('user').uid
      }
    })
    .catch((error) => {
      throw new Error(error.message)
    })
}
export async function deleteBet(id) {
  const ref = doc(db, 'simple_bets', id)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    if (snap.data().author.id === auth.currentUser.uid) {
      updateDoc(doc(db, 'simple_bets', id), { disabled: true })
    } else {
      throw new Error('Vous ne pouvez pas supprimer ce pari')
    }
    return deleteBetParticipations(ref)
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
export async function getAvatarWithDoc(ref) {
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
export async function getBetCategoryWithDoc(ref) {
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
  let list = snap.docs.map((doc) => {
    return getBetWithDoc(doc.data().bet)
      .then((res) => {
        return {
          participationId: doc.id,
          ...res
        }
      })
      .catch(() => {
        return { deletedBet: true }
      })
  })
  list = await Promise.all(list)
  return list.filter((item) => {
    return !item.deletedBet && !item.disabled
  })
}
export async function getParticipationCount(betId, betCollectionName = 'simple_bets') {
  const ref = query(collection(db, 'participations'), where('bet', '==', doc(db, betCollectionName, betId)))
  const snap = await getDocs(ref)
  return snap.docs.length
  // const snap = await getCountFromServer(ref)
  // return snap.data().count
}
export async function participate(betId) {
  const ref = query(
    collection(db, 'participations'),
    where('user', '==', doc(db, 'users', auth.currentUser.uid)),
    where('bet', '==', doc(db, 'simple_bets', betId))
  )
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
export async function iParticipate(betId, betCollectionName = 'simple_bets') {
  const ref = query(
    collection(db, 'participations'),
    where('user', '==', doc(db, 'users', auth.currentUser.uid)),
    where('bet', '==', doc(db, betCollectionName, betId))
  )
  const snap = await getDocs(ref)
  return snap.docs.length > 0
}
export async function deleteMyParticipations() {
  const ref = query(collection(db, 'participations'), where('user', '==', doc(db, 'users', auth.currentUser.uid)))
  const snap = await getDocs(ref)
  snap.docs.forEach((singleDoc) => {
    deleteDoc(doc(db, 'participations', singleDoc.id))
  })
}
export async function deleteBetParticipations(betDoc) {
  const ref = query(collection(db, 'participations'), where('bet', '==', betDoc))
  const snap = await getDocs(ref)
  snap.docs.forEach((singleDoc) => {
    deleteDoc(doc(db, 'participations', singleDoc.id))
  })
}
export async function deleteParticipation(betId, betCollectionName = 'simple_bets') {
  const ref = query(
    collection(db, 'participations'),
    where('user', '==', doc(db, 'users', auth.currentUser.uid)),
    where('bet', '==', doc(db, betCollectionName, betId))
  )
  const snap = await getDocs(ref)
  return deleteDoc(doc(db, 'participations', snap.docs[0].id))
}
