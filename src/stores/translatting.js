export default () => ({
  translateSignupError(error) {
    if (error.message === 'Nom d\'utilisateur déjà utilisé') return error.message
    switch (error.message) {
      case 'Firebase: Error (auth/email-already-in-use).':
        return 'Cette adresse email est déjà utilisée'
      case 'Firebase: Error (auth/invalid-email).':
        return 'Email invalide'
      default:
        return 'Une erreur est survenue'
    }
  },
  translateSigninError(error) {
    switch (error.message) {
      case 'Firebase: Error (auth/wrong-password).':
        return 'Identifiants incorrects'
      case 'Firebase: Error (auth/user-not-found).':
        return 'Identifiants incorrects'
      default:
        return 'Une erreur est survenue'
    }
  },
  translateLogoutError(error) {
    switch (error.message) {
      default:
        return 'Une erreur est survenue'
    }
  },
  translateDeleteUserError(error) {
    switch (error.message) {
      default:
        return 'Une erreur est survenue'
    }
  },
  translateUpdatePasswordError(error) {
    switch (error.message) {
      default:
        return 'Une erreur est survenue'
    }
  },
  translateUpdateUserError(error) {
    switch (error.message) {
      default:
        return 'Une erreur est survenue'
    }
  },
  translateGetUserError(error) {
    switch (error.message) {
      default:
        return 'Une erreur est survenue'
    }
  }
})
