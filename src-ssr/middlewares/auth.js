import { ssrMiddleware } from "quasar/wrappers"

export default ssrMiddleware(({ app, resolveUrlPath, publicPath, render }) => {
  if (false) {
    render()
  } else {
    // redirect to login page
  }
})
