import { auth, app } from 'src/boot/firebase'
import { doc, getDoc, setDoc, updateDoc, query, deleteDoc, collection, getDocs, where, getFirestore } from 'firebase/firestore'
import { deleteUser } from 'firebase/auth'
import { deleteMyParticipations } from './participationService'
import { addTokenTransaction } from './tokenTransactionService'
import { uid } from 'quasar'

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
export async function getUserByDoc(ref) {
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
export async function generateUniqueReferalCode(referalCode = uid().split('-')[0]) {
  const q = query(collection(db, 'users'), where('myReferalCode', '==', referalCode))
  const querySnapshot = await getDocs(q)
  if (querySnapshot.size > 0) {
    return generateUniqueReferalCode(uid().split('-')[0])
  }
  return referalCode
}

export async function addUser(userUid, payload, username) {
  const myReferalCode = generateUniqueReferalCode()

  payload = {
    ...payload,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  let userPayload = {
    username,
    avatar: doc(db, 'avatars', process.env.DEFAULT_AVATAR_ID),
    newsletter: payload.newsletter,
    disabled: false,
    winMultiplier: 1,
    myReferalCode,
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt
  }
  if (payload.referralCode) {
    userPayload = {
      ...userPayload,
      referralCode: payload.referralCode.replace('#', '').toLowerCase()
    }
  }

  const toReturn = {
    ...payload,
    ...userPayload,
    uid: userUid
  }

  await setDoc(doc(db, 'users_data', userUid), {
    birthday: payload.birthday,
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt
  })

  const user = await setDoc(doc(db, 'users', userUid), userPayload)

  return addTokenTransaction(process.env.DEFAULT_TOKEN_AMOUNT, 'start', user.id).then(() => {
    return toReturn
  })
}
export function updateUserData(userUid, payload) {
  payload = {
    ...payload,
    updatedAt: new Date()
  }
  return updateDoc(doc(db, 'users_data', userUid), payload)
    .then(() => {
      return payload
    })
    .catch((error) => {
      throw new Error(error.message)
    })
}
export function updateUser(userUid, payload) {
  return updateDoc(doc(db, 'users', userUid), payload)
    .then(() => {
      return payload
    })
    .catch((error) => {
      throw new Error(error.message)
    })
}
export async function updateUserName(userUid, username) {
  const q = query(collection(db, 'users'), where('username', '==', username.trim()), where('disabled', '==', false))
  const querySnapshot = await getDocs(q)
  if (querySnapshot.size > 0) {
    throw new Error("Nom d'utilisateur déjà utilisé")
  }
  const payload = {
    username: username.trim(),
    updatedAt: new Date()
  }
  return updateDoc(doc(db, 'users', userUid), payload)
    .then(() => {
      return payload
    })
    .catch((error) => {
      throw new Error(error.message)
    })
}
export async function deleteUserData() {
  await updateDoc(doc(db, 'users', auth.currentUser.userUid), {
    disabled: true
  }).catch((error) => {
    throw new Error(error.message)
  })
  await deleteMyParticipations().catch((error) => {
    throw new Error(error.message)
  })
  await deleteDoc(doc(db, 'users_data', auth.currentUser.userUid)).catch((error) => {
    throw new Error(error.message)
  })
  await deleteUser(auth.currentUser).catch((error) => {
    throw new Error(error.message)
  })
}
export async function getUserWalletByDoc(userDoc) {
  const snap = await getDoc(userDoc)
  if (snap.exists()) {
    return snap.data().tokenCount
  } else {
    throw new Error('No such data!')
  }
}
export async function getUserWinMultiplierByDoc(userDoc) {
  const snap = await getDoc(userDoc)
  if (snap.exists()) {
    return snap.data().winMultiplier
  } else {
    throw new Error('No such data!')
  }
}
