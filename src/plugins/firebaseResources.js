import { collection, getDocs } from 'firebase/firestore/lite'
import db from 'src/boot/firebase'

// leave the export, even if you don't use it
export default ({ app, router, store, Vue }) => ({
// export default $firebaseResources => ({

  async getSimpleBets() {
    const betsCol = collection(db, 'simple_bets')
    const betSnapshot = await getDocs(betsCol)
    const betList = betSnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data()
      }
    })
    return betList
  }

})
