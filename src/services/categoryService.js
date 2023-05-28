import { doc, getDoc, collection, getDocs, getFirestore } from 'firebase/firestore'
import { app } from 'src/boot/firebase'

const db = getFirestore(app)

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
