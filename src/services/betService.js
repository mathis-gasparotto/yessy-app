import { app, auth } from 'src/boot/firebase'
import {
  doc,
  getDoc,
  updateDoc,
  query,
  collection,
  getDocs,
  where,
  addDoc,
  getFirestore,
  orderBy
} from 'firebase/firestore'
import { getUserWinMultiplierByDoc, getUserByDoc } from './userService'
import { getBetCategoryByDoc } from './categoryService'
import { addChoice,/*, deleteChoices*/
getChoiceOdd} from './choiceService'
import { deleteBetParticipations, getParticipations } from './participationService'
import { addTokenTransaction } from './tokenTransactionService'

const db = getFirestore(app)

export async function getHebdoBet() {
  const now = new Date()
  const ref = query(collection(db, 'hebdo_bets'), where('endAt', '>', now), where('disabled', '==', false))
  const snap = await getDocs(ref)
  let list = await snap.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })
  list = list.filter((item) => new Date(item.startAt.seconds * 1000) <= now)
  return list[0]
}
export async function getHebdoBetById(id) {
  const ref = doc(db, 'hebdo_bets', id)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    const category = await getBetCategoryByDoc(snap.data().category)
    return {
      id: snap.id,
      ...snap.data(),
      category
    }
  } else {
    throw new Error('No such data!')
  }
}
export async function getBets(type = 'all', categoryId = null, privacy = 'public') {
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
  if (categoryId) {
    conditions.push(where('category', '==', doc(db, 'bet_categories', categoryId)))
  }
  const ref = query(collection(db, 'simple_bets'), ...conditions)
  const snap = await getDocs(ref)
  // if (type === 'active') {
  //   snap.docs = snap.docs.filter((item) => new Date(item.data().endAt.seconds * 1000) > now)
  // }
  let list = await snap.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })
  await list.forEach(async (bet) => {
    const category = await getBetCategoryByDoc(bet.category)
      .then((res) => {
        return res
      })
      .catch((error) => {
        throw new Error(error.message)
      })
    bet.category = category
  })
  if (type === 'active') {
    list = list.filter((item) => new Date(item.endAt.seconds * 1000) > now)
  }
  list = list.sort((a, b) => {
    return b.createdAt.seconds * 1000 - a.createdAt.seconds * 1000
  })
  // return Promise.all(list).then((res) => {
  //   return res
  // })
  return Promise.all(list)
}
export async function getBetWithoutAuthor(id) {
  const ref = doc(db, 'simple_bets', id)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    const category = await getBetCategoryByDoc(snap.data().category)
    return {
      id: snap.id,
      ...snap.data(),
      category
    }
  } else {
    throw new Error('No such data!')
  }
}
export async function getBet(id) {
  const ref = doc(db, 'simple_bets', id)
  const snap = await getDoc(ref)
  if (snap.exists() && snap.data().disabled === false) {
    const author = await getUserByDoc(snap.data().author).catch(() => {
      return {
        username: 'Utilisateur supprimé',
        avatar: {
          url: process.env.DEFAULT_AVATAR_URL
        }
      }
    })
    const category = await getBetCategoryByDoc(snap.data().category)
    let toReturn = {
      id: snap.id,
      ...snap.data(),
      author,
      category
    }
    if (snap.data().winnerChoice) {
      const winnerChoice = await getDoc(snap.data().winnerChoice)
      toReturn = {
        ...toReturn,
        winnerChoice: {
          id: winnerChoice.id,
          ...winnerChoice.data()
        }
      }
    }
    return toReturn
  } else {
    throw new Error('No such data!')
  }
}
export async function getBetByDoc(ref) {
  const snap = await getDoc(ref)
  if (snap.exists()) {
    const author = await getUserByDoc(snap.data().author)
    const category = await getBetCategoryByDoc(snap.data().category)
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
export async function getJustBet(id, collectionName = 'simple_bets') {
  const ref = doc(db, collectionName, id)
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
export async function getJustBetByDoc(ref) {
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
export async function addBet(payload, choices, categoryId) {
  if (payload.customCost || payload.customReward) {
    if (!payload.customCost || !payload.customReward) {
      throw new Error('Veuillez renseigner la récompense personnalisée et la mise en jeu personnalisée')
    }
  }
  if (choices.length < 2) {
    throw new Error('Veuillez renseigner au moins deux choix')
  } else if (choices.length > 20) {
    throw new Error('Vous ne pouvez pas ajouter plus de 20 choix')
  }
  const betCreated = await addDoc(collection(db, 'simple_bets'), {
    ...payload,
    category: doc(db, 'bet_categories', categoryId),
    author: doc(db, 'users', auth.currentUser.uid),
    disabled: false
  })
    .then((ref) => {
      return {
        id: ref.id,
        ...payload,
        category: doc(db, 'bet_categories', categoryId),
        author: doc(db, 'users', auth.currentUser.uid)
      }
    })
    .catch((error) => {
      throw new Error(error.message)
    })

  // add choices linked to the bet
  const choicesCreated = await choices.map((choice, index) => {
    // return addChoice(choice.label, doc(db, 'simple_bets', betCreated.id), index)
    return addChoice(choice.label, betCreated.id, index)
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
      // await deleteChoices(ref)

      // delete all participations
      return deleteBetParticipations(ref)
    } else {
      throw new Error('Vous ne pouvez pas supprimer ce pari')
    }
  } else {
    throw new Error('No such data!')
  }
}
export async function isAuthor(betId, betCollectionName = 'simple_bets') {
  const ref = doc(db, betCollectionName, betId)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    return snap.data().author.id === auth.currentUser.uid
  } else {
    throw new Error('No such data!')
  }
}
export async function setWinnerChoice(betId, choiceId, betCollectionName = 'simple_bets') {
  // const choiceRef = doc(db, 'bet_choices', choiceId)
  const choiceRef = doc(db, `${betCollectionName}/${betId}/choices`, choiceId)
  const betRef = doc(db, betCollectionName, betId)
  // const snap = await getDoc(choiceRef)
  // if (snap.data().bet.id !== betRef.id) {
  //   throw new Error('Le choix ne correspond pas au pari')
  // }
  await updateDoc(betRef, { winnerChoice: choiceRef })
  const bet = await getJustBetByDoc(betRef)
  if (!bet.customCost && !bet.customReward) {
    const participations = await getParticipations(betId, betCollectionName)
    const winnerChoiceOdd = await getChoiceOdd(choiceRef.id, betId, betCollectionName)
    participations.forEach(async (participation) => {
      if (participation.choice.id === choiceRef.id) {
        const userWinMultiplier = await getUserWinMultiplierByDoc(participation.user)
        const amount = Math.round(participation.tokenAmount * winnerChoiceOdd * userWinMultiplier)
        await addTokenTransaction(amount, 'win', participation.user.id)
      }
    })
  }
  return true
}
export async function getMyBets() {
  const ref = query(
    collection(db, 'simple_bets'),
    where('author', '==', doc(db, 'users', auth.currentUser.uid)),
    where('disabled', '==', false),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(ref)
  const list = await snap.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })
  await list.forEach(async (bet) => {
    const category = await getBetCategoryByDoc(bet.category)
      .then((res) => {
        return res
      })
      .catch((error) => {
        throw new Error(error.message)
      })
    bet.category = category
  })
  // return Promise.all(list).then((res) => {
  //   return res
  // })
  return Promise.all(list)
}
export async function updateBetPrivacy(betId, newPrivacy) {
  const ref = doc(db, 'simple_bets', betId)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    if (snap.data().author.id === auth.currentUser.uid) {
      await updateDoc(ref, { privacy: newPrivacy })
      return {
        id: snap.id,
        ...snap.data(),
        privacy: newPrivacy
      }
    } else {
      throw new Error("Vous ne pouvez pas modifier ce pari, vous n'en êtes pas l'auteur")
    }
  } else {
    throw new Error('No such data!')
  }
}
