export default () => ({
  translateSignupError(error) {
    if (error.message === 'Nom d\'utilisateur déjà utilisé') return error.message
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Cette adresse email est déjà utilisée'
      case 'auth/invalid-email':
        return 'Email invalide'
      default:
        return 'Une erreur est survenue'
    }
  },
  translateSigninError(error) {
    switch (error.code) {
      case 'auth/wrong-password':
        return 'Identifiants incorrects'
      case 'auth/user-not-found':
        return 'Identifiants incorrects'
      default:
        return 'Une erreur est survenue'
    }
  },
  translateLogoutError(error) {
    switch (error.code) {
      default:
        return 'Une erreur est survenue'
    }
  }
})
