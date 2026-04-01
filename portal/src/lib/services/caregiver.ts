'use server'

import { createServiceClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function createCaregiver(data: Record<string, unknown>) {
  const supabase = createServiceClient()
  const { data: caregiver, error } = await supabase
    .from('caregivers')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/caregiver/profile')
  return caregiver
}

export async function updateCaregiver(id: string, data: Record<string, unknown>) {
  const supabase = createServiceClient()
  const { data: caregiver, error } = await supabase
    .from('caregivers')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/caregiver/profile')
  return caregiver
}

export async function getCaregiver(id: string) {
  const supabase = createServiceClient()
  const { data: caregiver, error } = await supabase
    .from('caregivers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return caregiver
}
