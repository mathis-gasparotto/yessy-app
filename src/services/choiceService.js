import { doc, query, deleteDoc, collection, getDocs, where, addDoc, getFirestore } from 'firebase/firestore'
import { app } from 'src/boot/firebase'

const db = getFirestore(app)

export async function getBetChoices(betDoc) {
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
export function addChoice(label, betDoc) {
  return addDoc(collection(db, 'bet_choices'), {
    label,
    bet: betDoc
  })
    .then((res) => {
      return {
        id: res.id,
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
