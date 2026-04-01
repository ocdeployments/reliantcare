// TODO: implement once Twilio credentials are provisioned
// env vars needed: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER

export async function sendSms(payload: { to: string; body: string }) {
  throw new Error('Twilio not configured')
}

export async function sendReferenceRequestSms(phone: string, name: string, caregiverName: string) {
  throw new Error('Twilio not configured')
}

export async function sendCaregiverOnboardingSms(phone: string, name: string) {
  throw new Error('Twilio not configured')
}
