import { auth } from '@clerk/nextjs/server'

export async function getAuthUser() {
  const { userId } = await auth()
  return userId
}

export function getRoleFromMetadata(): string | null {
  // Role enforcement is handled server-side
  // Clerk publicMetadata stores: caregiver | agency | agency_admin | supervisor | platform_admin
  return null
}
