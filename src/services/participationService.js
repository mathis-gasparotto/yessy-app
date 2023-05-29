import { app, auth } from 'src/boot/firebase'
import { doc, query, deleteDoc, collection, getDocs, where, addDoc, getFirestore } from 'firebase/firestore'
import { getBetByDoc } from './betService'
import { getMyWallet, addTokenTransaction, deleteTokenTransaction } from './tokenTransactionServices'
import { LocalStorage } from 'quasar'

const db = getFirestore(app)

export async function getMyParticipations() {
  const ref = query(collection(db, 'participations'), where('user', '==', doc(db, 'users', auth.currentUser.uid)))
  const snap = await getDocs(ref)
  let list = snap.docs.map((doc) => {
    return getBetByDoc(doc.data().bet)
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
export async function getParticipations(betId, betCollectionName = 'simple_bets') {
  const ref = query(collection(db, 'participations'), where('bet', '==', doc(db, betCollectionName, betId)))
  const snap = await getDocs(ref)
  const list = snap.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })
  return list
}
export async function getMyTokenParticipation(betId, betCollectionName = 'simple_bets') {
  const ref = query(collection(db, 'participations'), where('bet', '==', doc(db, betCollectionName, betId)), where('user', '==', doc(db, 'users', auth.currentUser.uid)))
  const snap = await getDocs(ref)
  return snap.docs[0].data().tokenAmount
}
export async function participate(betId, choiceId, tokenAmount = null) {
  const ref = query(
    collection(db, 'participations'),
    where('user', '==', doc(db, 'users', auth.currentUser.uid)),
    where('bet', '==', doc(db, 'simple_bets', betId))
  )
  // const count = console.log(await getCountFromServer(ref))
  const snap = await getDocs(ref)
  if (snap.docs.length > 0) {
    throw new Error('Vous participez déjà à ce pari')
  }
  const currentWallet = await getMyWallet()
  if (tokenAmount > currentWallet) {
    throw new Error("Vous n'avez pas assez de jetons")
  }
  let payload = {
    user: doc(db, 'users', auth.currentUser.uid),
    bet: doc(db, 'simple_bets', betId),
    choice: doc(db, 'bet_choices', choiceId)
  }
  if (tokenAmount) {
    tokenAmount = parseInt(tokenAmount)
    payload = {
      ...payload,
      tokenAmount
    }
  }
  const transaction = await addTokenTransaction(-tokenAmount, 'participation')

  return addDoc(collection(db, 'participations'), payload).catch((error) => {
    deleteTokenTransaction(transaction.id).then(() => {
      throw new Error(error.message)
    })
  })
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
  snap.docs.forEach(async (singleDoc) => {
    // refund all participants
    const refund = await addTokenTransaction(singleDoc.data().tokenAmount, 'refund', singleDoc.data().user.id)

    deleteDoc(doc(db, 'participations', singleDoc.id)).catch((err) => {
      // if error, delete the refund
      deleteTokenTransaction(refund.id).then(() => {
        throw new Error(err.message)
      })
    })
  })
}
export async function deleteParticipation(betId, betCollectionName = 'simple_bets') {
  const ref = query(
    collection(db, 'participations'),
    where('user', '==', doc(db, 'users', auth.currentUser.uid)),
    where('bet', '==', doc(db, betCollectionName, betId))
  )
  const snap = await getDocs(ref)
  await addTokenTransaction(snap.docs[0].data().tokenAmount, 'refund').then((newTokenCount) => {
    const user = LocalStorage.getItem('user')
    LocalStorage.set('user', { ...user, tokenCount: newTokenCount })
  })
  return deleteDoc(doc(db, 'participations', snap.docs[0].id))
}
