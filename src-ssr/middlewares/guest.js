import { ssrMiddleware } from "quasar/wrappers"
import { auth } from 'src/boot/firebase'

export default ssrMiddleware(({ app, resolveUrlPath, publicPath, render }) => {
  if (!auth.currentUser) {
    render()
  } else {
    // redirect to home page
  }
})
