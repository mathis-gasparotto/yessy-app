import { auth, app } from 'src/boot/firebase'
import { doc, getDoc, setDoc, updateDoc, query, deleteDoc, collection, getDocs, where, getFirestore } from 'firebase/firestore'
import { deleteUser } from 'firebase/auth'
import { deleteMyParticipations } from './participationService'

const db = getFirestore(app)

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
export async function getMyWallet() {
  const ref = doc(db, 'users', auth.currentUser.uid)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    return snap.data().tokenCount
  } else {
    throw new Error('No such data!')
  }
}
export async function getUserWalletWithDoc(userDoc) {
  const snap = await getDoc(userDoc)
  if (snap.exists()) {
    return snap.data().tokenCount
  } else {
    throw new Error('No such data!')
  }
}
export async function updateMyWallet(amount) {
  const currentAmount = await getMyWallet()
  return updateDoc(doc(db, 'users', auth.currentUser.uid), {tokenCount: currentAmount + amount})
    .then(() => {
      return currentAmount + amount
    })
    .catch((error) => {
      throw new Error(error.message)
    })
}
export async function updateUserWalletWithDoc(amount, userDoc) {
  const currentAmount = await getUserWalletWithDoc(userDoc)
  return updateDoc(userDoc, {tokenCount: currentAmount + amount})
    .then(() => {
      return currentAmount + amount
    })
    .catch((error) => {
      throw new Error(error.message)
    })
}
export async function getUserWinMultiplierWithDoc(userDoc) {
  const snap = await getDoc(userDoc)
  if (snap.exists()) {
    return snap.data().winMultiplier
  } else {
    throw new Error('No such data!')
  }
}
