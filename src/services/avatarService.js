import { doc, getDoc, collection, getDocs, getFirestore } from 'firebase/firestore'
import { app } from 'src/boot/firebase'

const db = getFirestore(app)

export async function getAvatars() {
  const ref = collection(db, 'avatars')
  const snap = await getDocs(ref)
  const list = snap.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })
  return list
}
export async function getAvatar(id) {
  const ref = doc(db, 'avatars', id)
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
export async function getAvatarByDoc(avatarDoc) {
  const snap = await getDoc(avatarDoc)
  if (snap.exists()) {
    return {
      id: snap.id,
      ...snap.data()
    }
  } else {
    throw new Error('No such data!')
  }
}
