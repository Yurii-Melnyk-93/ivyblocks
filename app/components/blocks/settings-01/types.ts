export interface ProfileValues {
  name: string
  email: string
}

export type ProfileField = keyof ProfileValues

/** Per-field errors: only the fields listed here are highlighted. */
export type ProfileFieldErrors = Partial<Record<ProfileField, string>>

export interface NotificationSetting {
  id: string
  label: string
  description?: string
  enabled: boolean
}

export interface SettingsPayload {
  profile: ProfileValues
  /** Notification id → enabled. */
  notifications: Record<string, boolean>
}

export interface SettingsCopy {
  title: string
  description: string
  profileTitle: string
  profileDescription: string
  nameLabel: string
  emailLabel: string
  notificationsTitle: string
  notificationsDescription: string
  saveLabel: string
  pendingLabel: string
  resetLabel: string
  savedMessage: string
}
