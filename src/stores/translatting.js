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
      case 'INVALID_PASSWORD':
        return 'Identifiants incorrects'
      case 'EMAIL_NOT_FOUND':
        return 'Identifiants incorrects'
      case 'Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).':
        return 'Vous avez effectué trop de tentative, veuillez attendre un moment avant de réessayer'
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
      case 'Firebase: Error (auth/wrong-password).':
        return 'Ancien mot de passe incorrect'
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
  },
  translateUpdateUserEmailError(error) {
    switch (error.message) {
      default:
        return 'Une erreur est survenue'
    }
  }
})
