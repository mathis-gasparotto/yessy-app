import { app, auth } from 'src/boot/firebase'
import { doc, query, collection, getDocs, where, addDoc, getFirestore, deleteDoc } from 'firebase/firestore'

const db = getFirestore(app)

export async function getMyWallet() {
  const ref = query(collection(db, 'token_transactions'), where('user', '==', doc(db, 'users', auth.currentUser.uid)))
  const snap = await getDocs(ref)
  let wallet = 0
  snap.docs.forEach((doc) => {
    wallet += doc.data().amount
  })
  return wallet
}
export async function addTokenTransaction(amount, type, userId = auth.currentUser.uid) {
  const payload = {
    user: doc(db, 'users', userId),
    amount,
    date: new Date(),
    type
  }
  const ref = collection(db, 'token_transactions')
  const snap = await addDoc(ref, payload)
  return {
    id: snap.id,
    ...payload
  }
}
export function deleteTokenTransaction(transactionId) {
  return deleteDoc(doc(db, 'token_transactions', transactionId))
}
