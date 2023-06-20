import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore'
import { auth, app } from 'src/boot/firebase'
import { addTokenTransaction } from './tokenTransactionService'
import {
  DAILY_TOKEN_GAIN,
  DAILY_TOKEN_GAIN_AFTER_14_DAYS,
  DAILY_TOKEN_GAIN_AFTER_30_DAYS,
  DAILY_TOKEN_GAIN_AFTER_7_DAYS,
  DAILY_TOKEN_GAIN_FREQUENCY_AFTER_30_DAYS
} from 'src/helpers/dailyRewardHelper'
import { LocalStorage } from 'quasar'
// import { getCurrentUser } from 'src/boot/firebase'

const db = getFirestore(app)

export async function dailyLogin(lastLogin = null) {
  // const user = await getCurrentUser()
  // if (!user) {
  //   return
  // }
  const userRef = doc(db, 'users', auth.currentUser.uid)
  const userDoc = await getDoc(userRef)
  const userData = userDoc.data()
  lastLogin = lastLogin instanceof Date ? lastLogin : new Date(userData.lastLoginAt.seconds * 1000)
  const now = new Date()
  updateDoc(userRef, {
    lastLoginAt: now
  })
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const lastLoginMidnight = new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate())
  const diffDays = Math.floor((nowMidnight - lastLoginMidnight) / (1000 * 60 * 60 * 24))
  if (diffDays === 1) {
    const newLoginStreak = userData.loginStreak + 1
    await updateDoc(userRef, {
      loginStreak: newLoginStreak
    })
    const tokenTransaction = await addTokenTransaction(getDailyTokenGain(newLoginStreak), 'daily_login')
    updateLocalStoreUser({
      loginStreak: newLoginStreak,
      lastLoginAt: now
    })
    return {
      loginStreak: newLoginStreak,
      lastLoginAt: now,
      tokenGain: tokenTransaction.amount
    }
  } else if (diffDays > 1 || diffDays < 0) {
    const newLoginStreak = 1
    await updateDoc(userRef, {
      loginStreak: newLoginStreak
    })
    const tokenTransaction = await addTokenTransaction(getDailyTokenGain(newLoginStreak), 'daily_login')
    updateLocalStoreUser({
      loginStreak: newLoginStreak,
      lastLoginAt: now
    })
    return {
      loginStreak: newLoginStreak,
      lastLoginAt: now,
      tokenGain: tokenTransaction.amount
    }
  }
  updateLocalStoreUser({
    lastLoginAt: now
  })
  return {
    lastLoginAt: now
  }
}

function getDailyTokenGain(loginStreak) {
  if (loginStreak >= 1 && loginStreak < 7) {
    return DAILY_TOKEN_GAIN
  } else if (loginStreak >= 7 && loginStreak < 14) {
    return DAILY_TOKEN_GAIN_AFTER_7_DAYS
  } else if (loginStreak >= 14 && loginStreak < 30) {
    return DAILY_TOKEN_GAIN_AFTER_14_DAYS
  } else if (loginStreak >= 30 && (loginStreak - 30) % DAILY_TOKEN_GAIN_FREQUENCY_AFTER_30_DAYS === 0) {
    return DAILY_TOKEN_GAIN_AFTER_30_DAYS
  }
}

function updateLocalStoreUser(payload) {
  const user = LocalStorage.getItem('user')
  LocalStorage.set('user', {
    ...user,
    ...payload
  })
}
// dailyLogin()
