export default () => ({
  translateSignupError(error) {
    if (error.message === "Nom d'utilisateur déjà utilisé") return error.message
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
  },
  translateDeleteBetError(error) {
    switch (error.message) {
      case 'Vous ne pouvez pas supprimer ce pari':
        return error.message
      default:
        return 'Une erreur est survenue'
    }
  },
  translateAddBetError(error) {
    switch (error.message) {
      case 'Veuillez renseigner la récompense personnalisée et la mise en jeu personnalisée':
        return error.message
      case 'Veuillez renseigner au moins deux choix':
        return error.message
      case 'Vous ne pouvez pas ajouter plus de 20 choix':
        return error.message
      default:
        return 'Une erreur est survenue'
    }
  },
  translateAddParticipationError(error) {
    switch (error.message) {
      case 'Vous participez déjà à ce pari':
        return error.message
      case "Vous n'avez pas assez de jetons":
        return error.message
      default:
        return 'Une erreur est survenue'
    }
  },
  translateDeleteParticipationError(error) {
    switch (error.message) {
      case 'Vous participez déjà à ce pari':
        return error.message
      default:
        return 'Une erreur est survenue'
    }
  },
  translateSetWinnerChoiceError(error) {
    switch (error.message) {
      case 'Le choix ne correspond pas au pari':
        return error.message
      default:
        return 'Une erreur est survenue'
    }
  },
  translateUpdateBetPrivacyError(error) {
    switch (error.message) {
      case "Vous ne pouvez pas modifier ce pari, vous n'en êtes pas l'auteur":
        return error.message
      default:
        return 'Une erreur est survenue lors de la modification du pari'
    }
  },
  translateGetBetCategoriesError(error) {
    switch (error.message) {
      default:
        return 'Une erreur est survenue lors du chargement des catégories'
    }
  },
  translateGetHebdoBetsError(error) {
    switch (error.message) {
      default:
        return 'Une erreur est survenue lors du chargement du pari hebdomadaire'
    }
  },
  translateGetParticipationError(error) {
    switch (error.message) {
      default:
        return 'Une erreur est survenue lors de la récupération de votre participation au pari'
    }
  },
  translateUpdateParticipationError(error) {
    switch (error.message) {
      case 'Vous ne pouvez pas modifier votre participation à un pari annulé':
        return error.message
      case 'Vous ne pouvez pas modifier votre participation à un pari terminé':
        return error.message
      default:
        return 'Une erreur est survenue lors de la modification de votre participation au pari'
    }
  }
})
