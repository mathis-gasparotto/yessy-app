import { app, auth } from 'src/boot/firebase'
import { doc, query, deleteDoc, collection, getDocs, where, addDoc, getFirestore } from 'firebase/firestore'
import { getBetWithDoc } from './betService'

const db = getFirestore(app)

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
