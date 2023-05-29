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
  orderBy,
  setDoc
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
  // const ref = query(
  //   collection(db, 'bet_choices'),
  //   where('bet', '==', doc(db, collectionName, betId)),
  //   orderBy('index', 'asc')
  // )
  const ref = collection(db, `${collectionName}/${betId}/choices`)
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
// export async function getBetChoicesByDoc(betDoc) {
//   const ref = query(collection(db, 'bet_choices'), where('bet', '==', betDoc))
//   const snap = await getDocs(ref)
//   const list = snap.docs.map((doc) => {
//     return {
//       id: doc.id,
//       ...doc.data()
//     }
//   })
//   return list
// }
// export function addChoice(label, betDoc, index) {
//   return addDoc(collection(db, 'bet_choices'), {
//     label,
//     bet: betDoc,
//     index
//   })
export function addChoice(label, betId, index, collectionName = 'simple_bets') {
  return setDoc(doc(db, `${collectionName}/${betId}/choices`, `bet_choice_${index+1}`), { label })
    .then(() => {
      return {
        id: `bet_choice_${index+1}`,
        label
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
