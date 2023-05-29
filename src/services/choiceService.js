import {
  doc,
  query,
  deleteDoc,
  collection,
  getDocs,
  where,
  addDoc,
  getFirestore,
  getDoc,
  orderBy
} from 'firebase/firestore'
import { app, auth } from 'src/boot/firebase'

const db = getFirestore(app)

export async function getMyChoiceByBetId(betId, collectionName = 'simple_bets') {
  const ref = query(
    collection(db, 'participations'),
    where('bet', '==', doc(db, collectionName, betId)),
    where('user', '==', doc(db, 'users', auth.currentUser.uid))
  )
  const snap = await getDocs(ref)
  return getBetChoiceByDoc(snap.docs[0].data().choice)
}
export async function getBetChoiceByDoc(choiceDoc) {
  const snap = await getDoc(choiceDoc)
  return {
    id: snap.id,
    ...snap.data()
  }
}
export async function getBetChoices(betId, collectionName = 'simple_bets') {
  const ref = query(
    collection(db, 'bet_choices'),
    where('bet', '==', doc(db, collectionName, betId)),
    orderBy('index', 'asc')
  )
  const snap = await getDocs(ref)
  const list = snap.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })
  console.log(list)
  return list
}
export async function getBetChoicesByDoc(betDoc) {
  const ref = query(collection(db, 'bet_choices'), where('bet', '==', betDoc))
  const snap = await getDocs(ref)
  const list = snap.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })
  return list
}
export function addChoice(label, betDoc, index) {
  return addDoc(collection(db, 'bet_choices'), {
    label,
    bet: betDoc,
    index
  })
    .then((res) => {
      return {
        id: res.id,
        label,
        index
      }
    })
    .catch((error) => {
      throw new Error(error.message)
    })
}
export async function deleteChoices(betDoc) {
  const ref = query(collection(db, 'bet_choices'), where('bet', '==', betDoc))
  const snap = await getDocs(ref)
  snap.docs.forEach((singleDoc) => {
    deleteDoc(doc(db, 'bet_choices', singleDoc.id))
  })
}
