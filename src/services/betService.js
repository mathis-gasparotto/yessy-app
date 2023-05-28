import { app, auth } from 'src/boot/firebase'
import { doc, getDoc, updateDoc, query, collection, getDocs, where, addDoc, getFirestore } from 'firebase/firestore'
import { getUserWithDoc } from './userService'
import { getBetCategoryWithDoc } from './categoryService'
import { addChoice, deleteChoices } from './choiceService'
import { deleteBetParticipations } from './participationService'

const db = getFirestore(app)

export async function getBets(type = 'all', privacy = 'public') {
  const now = new Date()
  const conditions = [where('privacy', '==', privacy), where('disabled', '==', false)]
  if (type === 'future') {
    conditions.push(where('startAt', '>', now))
  } else if (type === 'active') {
    conditions.push(
      where('startAt', '<=', now)
      // where('endAt', '>', now)
    )
  } else if (type === 'ended') {
    conditions.push(where('endAt', '<=', now))
  }
  const ref = query(collection(db, 'simple_bets'), ...conditions)
  let snap = await getDocs(ref)
  // if (type === 'active') {
  //   snap.docs = snap.docs.filter((item) => new Date(item.data().endAt.seconds * 1000) > now)
  // }
  const list = await snap.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })
  list.forEach(async (bet) => {
    const author = await getUserWithDoc(bet.author)
      .then((res) => {
        return res
      })
      .catch((error) => {
        return {
          username: 'Utilisateur supprimé',
          avatar: {
            url: process.env.DEFAULT_AVATAR_URL
          }
        }
      })
    bet.author = author
    const category = await getBetCategoryWithDoc(bet.category)
      .then((res) => {
        return res
      })
      .catch((error) => {
        throw new Error(error.message)
      })
    bet.category = category
  })
  if (type === 'active') {
    return list.filter((item) => new Date(item.endAt.seconds * 1000) > now)
  }
  // return Promise.all(list).then((res) => {
  //   return res
  // })
  return Promise.all(list)
}
export async function getBet(id) {
  const ref = doc(db, 'simple_bets', id)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    const author = await getUserWithDoc(snap.data().author).catch(() => {
      return {
        username: 'Utilisateur supprimé',
        avatar: {
          url: process.env.DEFAULT_AVATAR_URL
        }
      }
    })
    const category = await getBetCategoryWithDoc(snap.data().category)
    return {
      id: snap.id,
      ...snap.data(),
      author,
      category
    }
  } else {
    throw new Error('No such data!')
  }
}
export async function getBetWithDoc(ref) {
  const snap = await getDoc(ref)
  if (snap.exists()) {
    const author = await getUserWithDoc(snap.data().author)
    const category = await getBetCategoryWithDoc(snap.data().category)
    return {
      id: snap.id,
      ...snap.data(),
      author,
      category
    }
  } else {
    throw new Error('No such data!')
  }
}
export async function addBet(payload, choices, categoryId) {
  if (payload.customCost || payload.customReward) {
    if (!payload.customCost || !payload.customReward) {
      throw new Error('Veuillez renseigner la récompense personnalisée et la mise en jeu personnalisée')
    }
  }
  const betCreated = await addDoc(collection(db, 'simple_bets'), {
    ...payload,
    category: doc(db, 'bet_categories', categoryId),
    author: doc(db, 'users', auth.currentUser.uid),
    disabled: false
    // authorId: LocalStorage.getItem('user').uid
  })
    .then((ref) => {
      return {
        id: ref.id,
        ...payload,
        category: doc(db, 'bet_categories', categoryId),
        author: doc(db, 'users', auth.currentUser.uid)
        // authorId: LocalStorage.getItem('user').uid
      }
    })
    .catch((error) => {
      throw new Error(error.message)
    })

  // add choices linked to the bet
  const choicesCreated = await choices.map((choice) => {
    return addChoice(choice.label, doc(db, 'simple_bets', betCreated.id))
      .then((ref) => {
        return {
          id: ref.id,
          label: choice.label,
          bet: doc(db, 'simple_bets', betCreated.id)
        }
      })
      .catch((error) => {
        throw new Error(error.message)
      })
  })

  return Promise.all(choicesCreated).then(() => {
    return {
      ...betCreated,
      chocies: choicesCreated
    }
  })
}
export async function deleteBet(id) {
  const ref = doc(db, 'simple_bets', id)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    if (snap.data().author.id === auth.currentUser.uid) {
      await updateDoc(doc(db, 'simple_bets', id), { disabled: true })

      // delete all choices
      await deleteChoices(ref)

      // delete all participations
      return deleteBetParticipations(ref)
    } else {
      throw new Error('Vous ne pouvez pas supprimer ce pari')
    }
  } else {
    throw new Error('No such data!')
  }
}
