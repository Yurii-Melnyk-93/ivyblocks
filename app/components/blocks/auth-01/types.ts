export type AuthMode = 'sign-in' | 'sign-up'

export interface SignInPayload {
  mode: 'sign-in'
  email: string
  password: string
}

export interface SignUpPayload {
  mode: 'sign-up'
  name: string
  email: string
  password: string
}

export type AuthPayload = SignInPayload | SignUpPayload

export interface AuthProvider {
  id: string
  label: string
}

export interface AuthCopy {
  title: string
  description: string
  submitLabel: string
  pendingLabel: string
  nameLabel: string
  emailLabel: string
  passwordLabel: string
  forgotPasswordLabel: string
  dividerLabel: string
  switchPrompt: string
  switchLabel: string
}
