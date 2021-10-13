import { Auth } from 'aws-amplify'

interface CognitoUser {
  email: string
  sub: string
}

const getUserFromCognito = (cognito) => {
  const { attributes, ...rest } = cognito
  return {
    user: { username: rest.username, ...attributes },
    rest,
    error: null,
  }
}

export const signIn = async ({ username, password }): Promise<{ user?: CognitoUser; error?: any }> => {
  try {
    const cognito = await Auth.signIn(username, password)
    return getUserFromCognito(cognito)
  } catch (err) {
    if (err.code === 'UserNotConfirmedException') {
      // The error happens if the user didn't finish the confirmation step when signing up
      // In this case you need to resend the code and confirm the user
      // About how to resend the code and confirm the user, please check the signUp part
    } else if (err.code === 'PasswordResetRequiredException') {
      // The error happens when the password is reset in the Cognito console
      // In this case you need to call forgotPassword to reset the password
      // Please check the Forgot Password part.
    } else if (err.code === 'NotAuthorizedException') {
      // The error happens when the incorrect password is provided
    } else if (err.code === 'UserNotFoundException') {
      // The error happens when the supplied username/email does not exist in the Cognito user pool
    } else {
      console.error('Error at Auth.signIn', err)
    }
    return { error: err }
  }
}

export const signUp = async ({ username, password, attributes = {} }): Promise<{ user?: CognitoUser; error?: any }> => {
  try {
    const onSignUp: any = await Auth.signUp({
      username,
      password,
      attributes,
    })
    const { user, userConfirmed, userSub } = onSignUp

    const nextUser = {
      username: userSub,
      sub: userSub,
      emailVerified: userConfirmed,
      email: user.username,
    }

    return { user: nextUser }
  } catch (err) {
    if (err.code === 'UserNotConfirmedException') {
      // The error happens if the user didn't finish the confirmation step when signing up
      // In this case you need to resend the code and confirm the user
      // About how to resend the code and confirm the user, please check the signUp part
    } else if (err.code === 'PasswordResetRequiredException') {
      // The error happens when the password is reset in the Cognito console
      // In this case you need to call forgotPassword to reset the password
      // Please check the Forgot Password part.
    } else if (err.code === 'NotAuthorizedException') {
      // The error happens when the incorrect password is provided
    } else if (err.code === 'UserNotFoundException') {
      // The error happens when the supplied username/email does not exist in the Cognito user pool
    } else {
      console.error('Error at Auth.signUp', err)
    }
    return { error: err }
  }
}

export const signOut = async () => {
  try {
    await Auth.signOut()
    return true
  } catch (err) {
    console.error('Error at Auth.signOut', err)
  }
}

export const currentAuthenticatedUser = async () => {
  try {
    const cognito = await Auth.currentAuthenticatedUser()
    return getUserFromCognito(cognito)
  } catch (err) {
    if (err === 'not authenticated') {
      // Handle if user is not logged in
      return { user: null }
    }
    console.error('Error at Auth.currentAuthenticatedUser', err)
  }
}

export const forgotPassword = async ({ username }) => {
  try {
    await Auth.forgotPassword(username)
  } catch (err) {
    return { error: err }
  }
}

export const forgotPasswordSubmit = async ({ username, code, password }) => {
  try {
    await Auth.forgotPasswordSubmit(username, code, password)
  } catch (err) {
    return { error: err }
  }
}
