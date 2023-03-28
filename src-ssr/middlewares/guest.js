import { ssrMiddleware } from "quasar/wrappers";

export default ssrMiddleware(({ app, resolveUrlPath, publicPath, render }) => {
  if (true) {
    render();
  } else {
    // redirect to home page
  }
});
