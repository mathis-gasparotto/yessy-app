export default () => ({
  translateSignupError(errorMessage) {
    switch (errorMessage) {
      case 'Firebase: Error (auth/email-already-in-use).':
        return 'Cette adresse email est déjà utilisée'
      default:
        return 'Une erreur est survenue'
    }
  },
  translateSigninError(errorMessage) {
    switch (errorMessage) {
      case 'Firebase: Error (auth/wrong-password).':
        return 'Identifiants incorrects'
      case 'Firebase: Error (auth/user-not-found).':
        return 'Identifiants incorrects'
      default:
        return 'Une erreur est survenue'
    }
  }
})
