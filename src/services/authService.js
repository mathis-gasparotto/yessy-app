import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  deleteUser
} from 'firebase/auth'
import { collection, query, where, getDocs, getFirestore, deleteDoc, doc } from 'firebase/firestore'
import { app, auth } from 'src/boot/firebase'
import createFormat from '../services/formatting'
import { LocalStorage } from 'quasar'
import { addUser, getUser } from './userService'
import { referralCodeInputedOnSignUp } from './tokenTransactionService'
// import { dailyLogin } from './dailyLoginService'

const db = getFirestore(app)

export async function signup(email, password, username, birthday, referralCode, newsletter) {
  const q = query(collection(db, 'users'), where('username', '==', username.trim()), where('disabled', '==', false))
  const querySnapshot = await getDocs(q)
  if (querySnapshot.size > 0) {
    throw new Error("Nom d'utilisateur déjà utilisé")
  }
  await setPersistence(auth, browserLocalPersistence)
  const user = await createUserWithEmailAndPassword(auth, email.trim(), password.trim())
    .then(async (userCredential) => {
      let payload = {
        email: userCredential.user.email,
        birthday: createFormat().dateTimeFormatToBDD(birthday),
        newsletter,
        lastLoginAt: new Date(),
        loginStreak: 1,
        winMultiplier: 1
      }
      if (referralCode) {
        payload.referralCode = referralCode.trim().toLowerCase()
      }
      return addUser(userCredential.user.uid, payload, username.trim())
        .then((res) => {
          LocalStorage.set('token', userCredential.user.refreshToken)
          LocalStorage.set('user', {
            ...payload,
            // lastLoginAt: new Date(parseInt(userCredential.user.metadata.lastLoginAt)),
            // birthday: new Date(res.birthday.seconds * 1000),
            // createdAt: new Date(res.createdAt.seconds * 1000),
            // updatedAt: new Date(res.updatedAt.seconds * 1000),
            uid: userCredential.user.uid
          })
          return res
        })
        .catch((error) => {
          cancelSignup(userCredential.user.uid)
          throw new Error(error.message)
        })
    })
    .catch((error) => {
      throw new Error(error.message)
    })
  if (referralCode) {
    referralCodeInputedOnSignUp(user.uid, referralCode.trim().toLowerCase())
  }
}

export async function login(email, password) {
  await setPersistence(auth, browserLocalPersistence)
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      return getUser(userCredential.user.uid)
        .then((res) => {
          // const dailyLoginData = await dailyLogin(new Date (res.lastLoginAt.seconds * 1000))
          LocalStorage.set('token', userCredential.user.refreshToken)
          LocalStorage.set('user', {
            ...res,
            // lastLoginAt: new Date(parseInt(userCredential.user.metadata.lastLoginAt)),
            // birthday: new Date(res.birthday.seconds * 1000),
            // createdAt: new Date(res.createdAt.seconds * 1000),
            // updatedAt: new Date(res.updatedAt.seconds * 1000),
            uid: userCredential.user.uid,
            // ...dailyLoginData
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

export async function cancelSignup(userId) {
  await deleteDoc(doc(db, 'users', userId)).catch((error) => {
    throw new Error(error.message)
  })
  await deleteDoc(doc(db, 'users_data', userId)).catch((error) => {
    throw new Error(error.message)
  })
  if (auth.currentUser) {
    await deleteUser(auth.currentUser).catch((error) => {
      throw new Error(error.message)
    })
  }
}
