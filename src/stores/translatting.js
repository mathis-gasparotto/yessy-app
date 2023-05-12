export default () => ({
  translateSignupError(errorCode) {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Cette adresse email est déjà utilisée'
      case 'auth/invalid-email':
        return 'Email invalide'
      default:
        return 'Une erreur est survenue'
    }
  },
  translateSigninError(errorCode) {
    switch (errorCode) {
      case 'auth/wrong-password':
        return 'Identifiants incorrects'
      case 'auth/user-not-found':
        return 'Identifiants incorrects'
      default:
        return 'Une erreur est survenue'
    }
  }
})
