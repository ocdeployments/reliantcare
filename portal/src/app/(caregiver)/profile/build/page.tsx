'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Inter } from 'next/font/google'
import {
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Upload,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createCaregiver } from '@/lib/services/caregiver'

const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '700', '900'] })

// ─── Design Tokens ────────────────────────────────────────────────────────────
const NAVY = '#1A2B4A'
const AMBER = '#F59E0B'
const AMBER_LIGHT = '#FCD34D'
const AMBER_TINT = '#FEF3C7'
const WARM_BG = '#FAFAF8'

// ─── STEPS ────────────────────────────────────────────────────────────────────
const STEPS = [
  { index: 0, id: 'identity', label: 'Identity basics', desc: 'Name, photo, bio' },
  { index: 1, id: 'services', label: 'Services', desc: 'What you offer' },
  { index: 2, id: 'availability', label: 'Availability', desc: 'When and where' },
  { index: 3, id: 'certifications', label: 'Certifications', desc: 'Your credentials' },
  { index: 4, id: 'background', label: 'Background check', desc: 'Security clearance' },
  { index: 5, id: 'references', label: 'References', desc: 'Who vouches for you' },
]

// ─── ZOD SCHEMAS PER STEP ─────────────────────────────────────────────────────
const step0Schema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(500, 'Bio must be under 500 characters'),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  profile_photo_url: z.string().optional(),
})

const step1Schema = z.object({
  service_categories: z.array(z.string()).min(1, 'Select at least one service category'),
  clinical_specialties: z.array(z.string()).optional(),
  credentials: z.array(z.string()).min(1, 'Select at least one credential'),
})

const step2Schema = z.object({
  availability_status: z.enum(['available_now', 'open_to_opportunities', 'available_from', 'not_available']),
  notice_period: z.string().optional(),
  available_from_date: z.string().optional(),
  placement_types: z.array(z.string()).min(1, 'Select at least one placement type'),
  days_available: z.array(z.string()).optional(),
  time_slots: z.array(z.string()).optional(),
  client_preference: z.string().optional(),
  work_city: z.string().min(1, 'City is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  travel_radius: z.number().min(0).max(100).optional(),
  languages: z.array(z.string()).optional(),
})

const step3Schema = z.object({
  certifications: z
    .array(
      z.object({
        certification_name: z.string().min(1, 'Certification name is required'),
        issuing_body: z.string().optional(),
        certification_number: z.string().optional(),
        issue_date: z.string().optional(),
        expiry_date: z.string().optional(),
      })
    )
    .optional(),
})

const step4Schema = z.object({
  dps_check_status: z.enum(['pending', 'in_review', 'clear', 'flagged', 'expired']).optional(),
  vulnerable_sector: z.boolean().optional(),
})

const step5Schema = z.object({
  references: z
    .array(
      z.object({
        reference_name: z.string().min(1, 'Reference name is required'),
        relationship: z.string().min(1, 'Relationship is required'),
        organization: z.string().optional(),
        duration: z.string().optional(),
        contact_phone: z.string().optional(),
        contact_email: z.string().optional(),
        consent_given: z.boolean(),
      })
    )
    .optional(),
})

const combinedSchema = step0Schema
  .merge(step1Schema)
  .merge(step2Schema)
  .merge(
    step3Schema.extend({
      certifications: step3Schema.shape.certifications,
    })
  )
  .merge(step4Schema)
  .merge(step5Schema)

// ─── SERVICE CATEGORIES ───────────────────────────────────────────────────────
const SERVICE_CATEGORIES = [
  'Personal Care',
  'Mobility',
  'Nutrition',
  'Medication',
  'Household',
  'Companionship',
  'Dementia',
  'Complex Care',
  'Safety',
  'Transportation',
  'Technology',
]

// ─── CLINICAL SPECIALTIES ─────────────────────────────────────────────────────
const CLINICAL_SPECIALTIES = [
  "Dementia/Alzheimer's",
  "Parkinson's",
  'Memory care',
  'Palliative',
  'Post-hospital',
  'Stroke',
  'Mobility/transfers',
  'Medication management',
  'Complex personal care',
  'Behavioural support',
  'Diabetes',
  'Mental health',
  'Paediatric',
  'ABI',
  'Bospice',
  'Wound care',
]

// ─── CREDENTIALS ───────────────────────────────────────────────────────────────
const CREDENTIALS_LIST = [
  'PSW',
  'RN',
  'LPN',
  'CNA',
  'HHA',
  'OT Assistant',
  'PT Assistant',
  'Social Worker',
  'Hospital Support',
  'No formal credential',
]

// ─── AVAILABILITY DAYS ─────────────────────────────────────────────────────────
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening', 'Overnight']
const PLACEMENT_TYPES = [
  'Live-in',
  'Hourly',
  'Overnight',
  'Weekend only',
  'Holiday coverage',
  'Traveling care',
]
const NOTICE_PERIODS = [
  { value: 'immediately', label: 'Immediately' },
  { value: '1_week', label: '1 week notice' },
  { value: '2_weeks', label: '2 weeks notice' },
  { value: '1_month', label: '1 month notice' },
  { value: 'flexible', label: 'Flexible' },
]
const CLIENT_PREFERENCES = [
  { value: 'no_preference', label: 'No preference' },
  { value: 'elderly', label: 'Elderly' },
  { value: 'younger_adults', label: 'Younger adults' },
  { value: 'paediatric', label: 'Paediatric' },
  { value: 'end_of_life', label: 'End of life' },
  { value: 'single_client', label: 'Single client' },
  { value: 'multiple_clients', label: 'Multiple clients' },
]
const LANGUAGES = [
  'English',
  'French',
  'Spanish',
  'Portuguese',
  'Italian',
  'Mandarin',
  'Cantonese',
  'Tagalog',
  'Arabic',
  'Punjabi',
  'Hindi',
  'Urdu',
  'Other',
]

// ─── PROVINCES ─────────────────────────────────────────────────────────────────
const CANADIAN_PROVINCES = [
  'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT',
]

// ─── RELATIONSHIPS ─────────────────────────────────────────────────────────────
const RELATIONSHIPS = [
  { value: 'client', label: 'Client' },
  { value: 'family_member', label: 'Family member' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'co_worker', label: 'Co-worker' },
  { value: 'other', label: 'Other' },
]

// ─── STEP 0: IDENTITY ─────────────────────────────────────────────────────────
function StepIdentity({
  register,
  formData,
  setFormData,
  errors,
}: {
  register: ReturnType<typeof useForm>['register']
  formData: Record<string, unknown>
  setFormData: (data: Record<string, unknown>) => void
  errors: Record<string, { message?: string }>
}) {
  return (
    <div className="space-y-6">
      <div className="text-[18px] font-black tracking-[-0.02em] text-[#1A2B4A]">
        Tell us who you are
      </div>
      <p className="text-[13px] text-[#4B5563]">
        This information appears on your public profile so families can find and trust you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="first_name">First name <span className="text-[#F59E0B]">*</span></Label>
          <Input
            id="first_name"
            placeholder="e.g. Maria"
            {...register('first_name')}
            value={(formData.first_name as string) ?? ''}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          />
          {errors.first_name && (
            <p className="text-[12px] text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.first_name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="last_name">Last name <span className="text-[#F59E0B]">*</span></Label>
          <Input
            id="last_name"
            placeholder="e.g. Santos"
            {...register('last_name')}
            value={(formData.last_name as string) ?? ''}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          />
          {errors.last_name && (
            <p className="text-[12px] text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.last_name.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio">Professional bio <span className="text-[#F59E0B]">*</span></Label>
        <textarea
          id="bio"
          rows={4}
          placeholder="Describe your experience, approach to care, and what makes you special..."
          className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[14px] text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/20 transition-colors resize-none"
          {...register('bio')}
          value={(formData.bio as string) ?? ''}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        />
        {errors.bio && (
          <p className="text-[12px] text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.bio.message}
          </p>
        )}
        <p className="text-[12px] text-[#9CA3AF]">
          {((formData.bio as string) ?? '').length}/500 characters
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="city">City <span className="text-[#F59E0B]">*</span></Label>
          <Input
            id="city"
            placeholder="e.g. Toronto"
            {...register('city')}
            value={(formData.city as string) ?? ''}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
          {errors.city && (
            <p className="text-[12px] text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.city.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="province">Province <span className="text-[#F59E0B]">*</span></Label>
          <select
            id="province"
            className="flex h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-[14px] text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/20 transition-colors"
            value={(formData.province as string) ?? ''}
            onChange={(e) => setFormData({ ...formData, province: e.target.value })}
          >
            <option value="">Select province</option>
            {CANADIAN_PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.province && (
            <p className="text-[12px] text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.province.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="profile_photo_url">Profile photo URL</Label>
        <Input
          id="profile_photo_url"
          type="url"
          placeholder="https://..."
          {...register('profile_photo_url')}
          value={(formData.profile_photo_url as string) ?? ''}
          onChange={(e) => setFormData({ ...formData, profile_photo_url: e.target.value })}
        />
        <p className="text-[12px] text-[#9CA3AF]">Paste a link to your photo, or upload later.</p>
      </div>
    </div>
  )
}

// ─── STEP 1: SERVICES ─────────────────────────────────────────────────────────
function StepServices({
  formData,
  setFormData,
  errors,
}: {
  formData: Record<string, unknown>
  setFormData: (data: Record<string, unknown>) => void
  errors: Record<string, { message?: string }>
}) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (cat: string) => {
    const current = new Set(formData.service_categories as string[] ?? [])
    if (current.has(cat)) current.delete(cat)
    else current.add(cat)
    setFormData({ ...formData, service_categories: Array.from(current) })
  }

  const toggleSpecialty = (spec: string) => {
    const current = new Set(formData.clinical_specialties as string[] ?? [])
    if (current.has(spec)) current.delete(spec)
    else current.add(spec)
    setFormData({ ...formData, clinical_specialties: Array.from(current) })
  }

  const toggleCredential = (cred: string) => {
    const current = new Set(formData.credentials as string[] ?? [])
    if (current.has(cred)) current.delete(cred)
    else current.add(cred)
    setFormData({ ...formData, credentials: Array.from(current) })
  }

  const isCatOpen = (cat: string) => openCategories.has(cat)

  return (
    <div className="space-y-8">
      <div className="text-[18px] font-black tracking-[-0.02em] text-[#1A2B4A]">
        What do you offer?
      </div>

      {/* Section A: Service Categories */}
      <div className="space-y-3">
        <div className="text-[15px] font-bold text-[#1A2B4A] flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#FEF3C7] text-[#B45309] text-[11px] font-black">A</span>
          Service categories
        </div>
        <p className="text-[13px] text-[#4B5563]">Select all areas of care you can provide.</p>

        <div className="space-y-2">
          {SERVICE_CATEGORIES.map((cat) => {
            const isOpen = isCatOpen(cat)
            return (
              <div key={cat} className="rounded-xl border border-[rgba(26,43,74,0.08)] overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    toggleCategory(cat)
                    setOpenCategories((prev) => {
                      const next = new Set(prev)
                      if (next.has(cat)) next.delete(cat)
                      else next.add(cat)
                      return next
                    })
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 text-left transition-colors',
                    (formData.service_categories as string[] ?? []).includes(cat)
                      ? 'bg-[#FEF3C7]'
                      : 'bg-white hover:bg-gray-50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                        (formData.service_categories as string[] ?? []).includes(cat)
                          ? 'bg-[#F59E0B] border-[#F59E0B]'
                          : 'border-gray-300'
                      )}
                    >
                      {(formData.service_categories as string[] ?? []).includes(cat) && (
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <span className="text-[13px] font-semibold text-[#1A1A1A]">{cat}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#4B5563]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#4B5563]" />
                  )}
                </button>
              </div>
            )
          })}
        </div>
        {errors.service_categories && (
          <p className="text-[12px] text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.service_categories.message}
          </p>
        )}
      </div>

      {/* Section B: Clinical Specialties */}
      <div className="space-y-3">
        <div className="text-[15px] font-bold text-[#1A2B4A] flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#1A2B4A] text-white text-[11px] font-black">B</span>
          Clinical specialties
        </div>
        <p className="text-[13px] text-[#4B5563]">Select any specializations that apply to your experience.</p>
        <div className="flex flex-wrap gap-2">
          {CLINICAL_SPECIALTIES.map((spec) => {
            const selected = (formData.clinical_specialties as string[] ?? []).includes(spec)
            return (
              <button
                key={spec}
                type="button"
                onClick={() => toggleSpecialty(spec)}
                className={cn(
                  'inline-flex items-center rounded-full px-3 py-1.5 text-[12px] font-semibold border transition-all',
                  selected
                    ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#B45309]'
                    : 'bg-white border-[#E5E7EB] text-[#4B5563] hover:border-[#F59E0B]'
                )}
              >
                {selected && <CheckCircle className="w-3 h-3 mr-1.5" />}
                {spec}
              </button>
            )
          })}
        </div>
      </div>

      {/* Section C: Credentials */}
      <div className="space-y-3">
        <div className="text-[15px] font-bold text-[#1A2B4A] flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#1E3A8A] text-white text-[11px] font-black">C</span>
          Credentials
        </div>
        <p className="text-[13px] text-[#4B5563]">Select all credentials you hold.</p>
        <div className="grid grid-cols-2 gap-2">
          {CREDENTIALS_LIST.map((cred) => {
            const selected = (formData.credentials as string[] ?? []).includes(cred)
            return (
              <button
                key={cred}
                type="button"
                onClick={() => toggleCredential(cred)}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl px-4 py-3 text-left border transition-all',
                  selected
                    ? 'bg-[#FEF3C7] border-[#F59E0B]'
                    : 'bg-white border-[rgba(26,43,74,0.08)] hover:border-[#F59E0B]'
                )}
              >
                <div
                  className={cn(
                    'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0',
                    selected ? 'bg-[#F59E0B] border-[#F59E0B]' : 'border-gray-300'
                  )}
                >
                  {selected && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <span className={cn('text-[13px] font-semibold', selected ? 'text-[#B45309]' : 'text-[#1A1A1A]')}>
                  {cred}
                </span>
              </button>
            )
          })}
        </div>
        {errors.credentials && (
          <p className="text-[12px] text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.credentials.message}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── STEP 2: AVAILABILITY ─────────────────────────────────────────────────────
function StepAvailability({
  formData,
  setFormData,
  errors,
}: {
  formData: Record<string, unknown>
  setFormData: (data: Record<string, unknown>) => void
  errors: Record<string, { message?: string }>
}) {
  const availabilityStatus = (formData.availability_status as string) ?? ''

  const togglePlacementType = (type: string) => {
    const current = new Set(formData.placement_types as string[] ?? [])
    if (current.has(type)) current.delete(type)
    else current.add(type)
    setFormData({ ...formData, placement_types: Array.from(current) })
  }

  const toggleDay = (day: string) => {
    const current = new Set(formData.days_available as string[] ?? [])
    if (current.has(day)) current.delete(day)
    else current.add(day)
    setFormData({ ...formData, days_available: Array.from(current) })
  }

  const toggleTimeSlot = (slot: string) => {
    const current = new Set(formData.time_slots as string[] ?? [])
    if (current.has(slot)) current.delete(slot)
    else current.add(slot)
    setFormData({ ...formData, time_slots: Array.from(current) })
  }

  const toggleLanguage = (lang: string) => {
    const current = new Set(formData.languages as string[] ?? [])
    if (current.has(lang)) current.delete(lang)
    else current.add(lang)
    setFormData({ ...formData, languages: Array.from(current) })
  }

  return (
    <div className="space-y-8">
      <div className="text-[18px] font-black tracking-[-0.02em] text-[#1A2B4A]">
        When and where are you available?
      </div>

      {/* Availability Status */}
      <div className="space-y-3">
        <div className="text-[15px] font-bold text-[#1A2B4A]">Availability status</div>
        <div className="space-y-2">
          {[
            { value: 'available_now', label: 'Available now', desc: 'Ready to start immediately' },
            { value: 'open_to_opportunities', label: 'Open to opportunities', desc: 'Actively exploring options' },
            { value: 'available_from', label: 'Available from a specific date', desc: 'Planning ahead' },
            { value: 'not_available', label: 'Not available', desc: 'Currently unavailable' },
          ].map((option) => (
            <label
              key={option.value}
              className={cn(
                'flex items-start gap-3 rounded-xl p-4 border cursor-pointer transition-all',
                availabilityStatus === option.value
                  ? 'bg-[#FEF3C7] border-[#F59E0B]'
                  : 'bg-white border-[rgba(26,43,74,0.08)] hover:border-[#F59E0B]/50'
              )}
            >
              <div
                className={cn(
                  'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                  availabilityStatus === option.value
                    ? 'border-[#F59E0B]'
                    : 'border-gray-300'
                )}
              >
                {availabilityStatus === option.value && (
                  <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                )}
              </div>
              <input
                type="radio"
                value={option.value}
                checked={availabilityStatus === option.value}
                onChange={(e) => setFormData({ ...formData, availability_status: e.target.value })}
                className="sr-only"
              />
              <div>
                <div className="text-[13px] font-semibold text-[#1A1A1A]">{option.label}</div>
                <div className="text-[12px] text-[#4B5563]">{option.desc}</div>
              </div>
            </label>
          ))}
        </div>
        {errors.availability_status && (
          <p className="text-[12px] text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.availability_status.message}
          </p>
        )}
      </div>

      {/* Conditional: Notice Period */}
      {availabilityStatus === 'open_to_opportunities' && (
        <div className="space-y-1.5">
          <Label htmlFor="notice_period">Notice period</Label>
          <select
            id="notice_period"
            className="flex h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/20 transition-colors"
            value={(formData.notice_period as string) ?? ''}
            onChange={(e) => setFormData({ ...formData, notice_period: e.target.value })}
          >
            <option value="">Select notice period</option>
            {NOTICE_PERIODS.map((np) => (
              <option key={np.value} value={np.value}>{np.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Conditional: Available From Date */}
      {availabilityStatus === 'available_from' && (
        <div className="space-y-1.5">
          <Label htmlFor="available_from_date">Available from</Label>
          <Input
            id="available_from_date"
            type="date"
            value={(formData.available_from_date as string) ?? ''}
            onChange={(e) => setFormData({ ...formData, available_from_date: e.target.value })}
          />
        </div>
      )}

      {/* Placement Types */}
      <div className="space-y-3">
        <div className="text-[15px] font-bold text-[#1A2B4A]">Placement types</div>
        <div className="grid grid-cols-2 gap-2">
          {PLACEMENT_TYPES.map((type) => {
            const selected = (formData.placement_types as string[] ?? []).includes(type)
            return (
              <button
                key={type}
                type="button"
                onClick={() => togglePlacementType(type)}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl px-4 py-3 text-left border transition-all',
                  selected
                    ? 'bg-[#FEF3C7] border-[#F59E0B]'
                    : 'bg-white border-[rgba(26,43,74,0.08)] hover:border-[#F59E0B]'
                )}
              >
                <div
                  className={cn(
                    'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0',
                    selected ? 'bg-[#F59E0B] border-[#F59E0B]' : 'border-gray-300'
                  )}
                >
                  {selected && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <span className={cn('text-[13px] font-semibold', selected ? 'text-[#B45309]' : 'text-[#1A1A1A]')}>
                  {type}
                </span>
              </button>
            )
          })}
        </div>
        {errors.placement_types && (
          <p className="text-[12px] text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.placement_types.message}
          </p>
        )}
      </div>

      {/* Days & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="text-[15px] font-bold text-[#1A2B4A]">Days available</div>
          <div className="space-y-2">
            {DAYS_OF_WEEK.map((day) => {
              const selected = (formData.days_available as string[] ?? []).includes(day)
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-xl px-4 py-2.5 border transition-all',
                    selected
                      ? 'bg-[#FEF3C7] border-[#F59E0B]'
                      : 'bg-white border-[rgba(26,43,74,0.08)]'
                  )}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded border-2 flex items-center justify-center',
                      selected ? 'bg-[#F59E0B] border-[#F59E0B]' : 'border-gray-300'
                    )}
                  >
                    {selected && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className={cn('text-[13px] font-semibold', selected ? 'text-[#B45309]' : 'text-[#1A1A1A]')}>
                    {day}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-[15px] font-bold text-[#1A2B4A]">Time slots</div>
          <div className="space-y-2">
            {TIME_SLOTS.map((slot) => {
              const selected = (formData.time_slots as string[] ?? []).includes(slot)
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => toggleTimeSlot(slot)}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-xl px-4 py-2.5 border transition-all',
                    selected
                      ? 'bg-[#FEF3C7] border-[#F59E0B]'
                      : 'bg-white border-[rgba(26,43,74,0.08)]'
                  )}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded border-2 flex items-center justify-center',
                      selected ? 'bg-[#F59E0B] border-[#F59E0B]' : 'border-gray-300'
                    )}
                  >
                    {selected && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className={cn('text-[13px] font-semibold', selected ? 'text-[#B45309]' : 'text-[#1A1A1A]')}>
                    {slot}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Client Preference */}
      <div className="space-y-1.5">
        <Label htmlFor="client_preference">Client preference</Label>
        <select
          id="client_preference"
          className="flex h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/20 transition-colors"
          value={(formData.client_preference as string) ?? ''}
          onChange={(e) => setFormData({ ...formData, client_preference: e.target.value })}
        >
          <option value="">No preference</option>
          {CLIENT_PREFERENCES.map((cp) => (
            <option key={cp.value} value={cp.value}>{cp.label}</option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <div className="text-[15px] font-bold text-[#1A2B4A]">Work location</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="work_city">City <span className="text-[#F59E0B]">*</span></Label>
            <Input
              id="work_city"
              placeholder="e.g. Toronto"
              value={(formData.work_city as string) ?? ''}
              onChange={(e) => setFormData({ ...formData, work_city: e.target.value })}
            />
            {errors.work_city && (
              <p className="text-[12px] text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.work_city.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="postal_code">Postal code <span className="text-[#F59E0B]">*</span></Label>
            <Input
              id="postal_code"
              placeholder="e.g. M5V 3A8"
              value={(formData.postal_code as string) ?? ''}
              onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
            />
            {errors.postal_code && (
              <p className="text-[12px] text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.postal_code.message}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="travel_radius">Travel radius: {(formData.travel_radius as number) ?? 25} km</Label>
          <input
            id="travel_radius"
            type="range"
            min={0}
            max={100}
            step={5}
            value={(formData.travel_radius as number) ?? 25}
            onChange={(e) => setFormData({ ...formData, travel_radius: Number(e.target.value) })}
            className="w-full accent-[#F59E0B]"
          />
          <div className="flex justify-between text-[12px] text-[#9CA3AF]">
            <span>0 km</span>
            <span>100 km</span>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="space-y-3">
        <div className="text-[15px] font-bold text-[#1A2B4A]">Languages spoken</div>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => {
            const selected = (formData.languages as string[] ?? []).includes(lang)
            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLanguage(lang)}
                className={cn(
                  'inline-flex items-center rounded-full px-3 py-1.5 text-[12px] font-semibold border transition-all',
                  selected
                    ? 'bg-[#1A2B4A] border-[#1A2B4A] text-white'
                    : 'bg-white border-[#E5E7EB] text-[#4B5563] hover:border-[#1A2B4A]'
                )}
              >
                {selected && <CheckCircle className="w-3 h-3 mr-1.5" />}
                {lang}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── STEP 3: CERTIFICATIONS ───────────────────────────────────────────────────
function StepCertifications({
  formData,
  setFormData,
  errors,
}: {
  formData: Record<string, unknown>
  setFormData: (data: Record<string, unknown>) => void
  errors: Record<string, { message?: string }>
}) {
  type CertEntry = {
    certification_name: string
    issuing_body: string
    certification_number: string
    issue_date: string
    expiry_date: string
  }

  const certs = (formData.certifications as CertEntry[]) ?? []

  const updateCert = (index: number, field: keyof CertEntry, value: string) => {
    const updated = certs.map((c, i) =>
      i === index ? { ...c, [field]: value } : c
    )
    setFormData({ ...formData, certifications: updated })
  }

  const addCert = () => {
    setFormData({
      ...formData,
      certifications: [
        ...certs,
        { certification_name: '', issuing_body: '', certification_number: '', issue_date: '', expiry_date: '' },
      ],
    })
  }

  const removeCert = (index: number) => {
    setFormData({
      ...formData,
      certifications: certs.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-[18px] font-black tracking-[-0.02em] text-[#1A2B4A]">
        Your certifications
      </div>
      <p className="text-[13px] text-[#4B5563]">
        Add any professional certifications, licenses, or credentials. Families value verified credentials.
      </p>

      <div className="space-y-4">
        {certs.length === 0 && (
          <div className="text-center py-8 text-[13px] text-[#9CA3AF] border-2 border-dashed border-[#E5E7EB] rounded-xl">
            No certifications added yet. Click below to add your first one.
          </div>
        )}

        {certs.map((cert, idx) => (
          <Card key={idx} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <Badge variant="amber">Certification {idx + 1}</Badge>
                <button
                  type="button"
                  onClick={() => removeCert(idx)}
                  className="text-[#4B5563] hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Certification name <span className="text-[#F59E0B]">*</span></Label>
                  <Input
                    placeholder="e.g. PSW Certificate"
                    value={cert.certification_name}
                    onChange={(e) => updateCert(idx, 'certification_name', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Issuing body</Label>
                  <Input
                    placeholder="e.g. Ontario College"
                    value={cert.issuing_body}
                    onChange={(e) => updateCert(idx, 'issuing_body', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Certification number</Label>
                  <Input
                    placeholder="e.g. PSW-2024-001"
                    value={cert.certification_number}
                    onChange={(e) => updateCert(idx, 'certification_number', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label>Issue date</Label>
                    <Input
                      type="date"
                      value={cert.issue_date}
                      onChange={(e) => updateCert(idx, 'issue_date', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Expiry date</Label>
                    <Input
                      type="date"
                      value={cert.expiry_date}
                      onChange={(e) => updateCert(idx, 'expiry_date', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Upload certificate document</Label>
                <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-6 text-center cursor-pointer hover:border-[#F59E0B] transition-colors">
                  <Upload className="w-6 h-6 mx-auto mb-2 text-[#9CA3AF]" />
                  <p className="text-[13px] text-[#4B5563]">Click to upload or drag and drop</p>
                  <p className="text-[12px] text-[#9CA3AF]">PDF, JPG, PNG up to 10MB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <button
          type="button"
          onClick={addCert}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[#E5E7EB] text-[#4B5563] hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-[13px] font-semibold">Add certification</span>
        </button>
      </div>
    </div>
  )
}

// ─── STEP 4: BACKGROUND ──────────────────────────────────────────────────────
function StepBackground({
  formData,
  setFormData,
}: {
  formData: Record<string, unknown>
  setFormData: (data: Record<string, unknown>) => void
}) {
  const dpsStatus = (formData.dps_check_status as string) ?? 'pending'

  return (
    <div className="space-y-6">
      <div className="text-[18px] font-black tracking-[-0.02em] text-[#1A2B4A]">
        Background check
      </div>
      <p className="text-[13px] text-[#4B5563]">
        This information is kept confidential and only shared with agencies and families after your explicit consent.
      </p>

      <div className="bg-[#FEF3C7] rounded-xl p-4 text-[13px] text-[#B45309]">
        <strong>Note:</strong> ReliantCare uses encrypted, third-party verified background checks. Your data is never shared without your consent.
      </div>

      <div className="space-y-3">
        <div className="text-[15px] font-bold text-[#1A2B4A]">DPS check status</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { value: 'pending', label: 'Pending', color: 'text-[#9CA3AF]' },
            { value: 'in_review', label: 'In review', color: 'text-[#F59E0B]' },
            { value: 'clear', label: 'Clear', color: 'text-green-600' },
            { value: 'flagged', label: 'Flagged', color: 'text-red-500' },
            { value: 'expired', label: 'Expired', color: 'text-[#9CA3AF]' },
          ].map((opt) => (
            <label
              key={opt.value}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 border cursor-pointer transition-all',
                dpsStatus === opt.value
                  ? 'bg-[#FEF3C7] border-[#F59E0B]'
                  : 'bg-white border-[rgba(26,43,74,0.08)] hover:border-[#F59E0B]/50'
              )}
            >
              <div
                className={cn(
                  'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                  dpsStatus === opt.value ? 'border-[#F59E0B]' : 'border-gray-300'
                )}
              >
                {dpsStatus === opt.value && <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />}
              </div>
              <input
                type="radio"
                value={opt.value}
                checked={dpsStatus === opt.value}
                onChange={(e) => setFormData({ ...formData, dps_check_status: e.target.value })}
                className="sr-only"
              />
              <span className={cn('text-[13px] font-semibold', dpsStatus === opt.value ? 'text-[#B45309]' : 'text-[#1A1A1A]')}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-[15px] font-bold text-[#1A2B4A]">Vulnerable sector check</div>
        <label className="flex items-start gap-3 rounded-xl p-4 bg-white border border-[rgba(26,43,74,0.08)] cursor-pointer hover:border-[#F59E0B]/50 transition-all">
          <div
            className={cn(
              'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
              formData.vulnerable_sector ? 'bg-[#F59E0B] border-[#F59E0B]' : 'border-gray-300'
            )}
          >
            {formData.vulnerable_sector && <CheckCircle className="w-3.5 h-3.5 text-white" />}
          </div>
          <input
            type="checkbox"
            checked={(formData.vulnerable_sector as boolean) ?? false}
            onChange={(e) => setFormData({ ...formData, vulnerable_sector: e.target.checked })}
            className="sr-only"
          />
          <div>
            <div className="text-[13px] font-semibold text-[#1A1A1A]">I have a valid vulnerable sector check</div>
            <div className="text-[12px] text-[#4B5563]">
              This check is required for all caregivers working with children, elderly, or vulnerable adults.
            </div>
          </div>
        </label>
      </div>
    </div>
  )
}

// ─── STEP 5: REFERENCES ──────────────────────────────────────────────────────
function StepReferences({
  formData,
  setFormData,
  errors,
}: {
  formData: Record<string, unknown>
  setFormData: (data: Record<string, unknown>) => void
  errors: Record<string, { message?: string }>
}) {
  type RefEntry = {
    reference_name: string
    relationship: string
    organization: string
    duration: string
    contact_phone: string
    contact_email: string
    consent_given: boolean
  }

  const refs = (formData.references as RefEntry[]) ?? []

  const updateRef = (index: number, field: keyof RefEntry, value: string | boolean) => {
    const updated = refs.map((r, i) =>
      i === index ? { ...r, [field]: value } : r
    )
    setFormData({ ...formData, references: updated })
  }

  const addRef = () => {
    setFormData({
      ...formData,
      references: [
        ...refs,
        { reference_name: '', relationship: '', organization: '', duration: '', contact_phone: '', contact_email: '', consent_given: false },
      ],
    })
  }

  const removeRef = (index: number) => {
    setFormData({
      ...formData,
      references: refs.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-[18px] font-black tracking-[-0.02em] text-[#1A2B4A]">
        Who vouches for you?
      </div>
      <p className="text-[13px] text-[#4B5563]">
        Add professional references who can speak to your caregiving abilities. References are contacted only after you consent.
      </p>

      <div className="space-y-4">
        {refs.length === 0 && (
          <div className="text-center py-8 text-[13px] text-[#9CA3AF] border-2 border-dashed border-[#E5E7EB] rounded-xl">
            No references added yet. Add at least one professional reference.
          </div>
        )}

        {refs.map((ref, idx) => (
          <Card key={idx} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <Badge variant="navy">Reference {idx + 1}</Badge>
                <button
                  type="button"
                  onClick={() => removeRef(idx)}
                  className="text-[#4B5563] hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Full name <span className="text-[#F59E0B]">*</span></Label>
                  <Input
                    placeholder="e.g. Jane Smith"
                    value={ref.reference_name}
                    onChange={(e) => updateRef(idx, 'reference_name', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Relationship <span className="text-[#F59E0B]">*</span></Label>
                  <select
                    className="flex h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/20 transition-colors"
                    value={ref.relationship}
                    onChange={(e) => updateRef(idx, 'relationship', e.target.value)}
                  >
                    <option value="">Select relationship</option>
                    {RELATIONSHIPS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Organization</Label>
                  <Input
                    placeholder="e.g. Sunnyside Care Home"
                    value={ref.organization}
                    onChange={(e) => updateRef(idx, 'organization', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Duration of relationship</Label>
                  <Input
                    placeholder="e.g. 2 years"
                    value={ref.duration}
                    onChange={(e) => updateRef(idx, 'duration', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Phone number</Label>
                  <Input
                    type="tel"
                    placeholder="(416) 555-0100"
                    value={ref.contact_phone}
                    onChange={(e) => updateRef(idx, 'contact_phone', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Email address</Label>
                  <Input
                    type="email"
                    placeholder="jane@example.com"
                    value={ref.contact_email}
                    onChange={(e) => updateRef(idx, 'contact_email', e.target.value)}
                  />
                </div>
              </div>

              {/* Consent */}
              <div className="space-y-3 pt-2 border-t border-[rgba(26,43,74,0.08)]">
                <div className="text-[15px] font-bold text-[#1A2B4A]">Consent</div>
                <label className="flex items-start gap-3 rounded-xl p-4 bg-[#FEF3C7] border border-[#F59E0B]/30 cursor-pointer">
                  <div
                    className={cn(
                      'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                      ref.consent_given ? 'bg-[#F59E0B] border-[#F59E0B]' : 'border-gray-300'
                    )}
                  >
                    {ref.consent_given && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={ref.consent_given}
                    onChange={(e) => updateRef(idx, 'consent_given', e.target.checked)}
                    className="sr-only"
                  />
                  <div>
                    <div className="text-[13px] font-semibold text-[#B45309]">
                      I have permission to share this reference
                    </div>
                    <div className="text-[12px] text-[#B45309]/80">
                      By checking this, you confirm you have asked this person and they agreed to be contacted.
                    </div>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>
        ))}

        <button
          type="button"
          onClick={addRef}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[#E5E7EB] text-[#4B5563] hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-[13px] font-semibold">Add reference</span>
        </button>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function ProfileBuildPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [stepErrors, setStepErrors] = useState<Record<string, { message?: string }>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const goToStep = (index: number) => {
    if (index < currentStep) {
      setCurrentStep(index)
      setStepErrors({})
    }
  }

  const getStepSchema = (step: number) => {
    switch (step) {
      case 0: return step0Schema
      case 1: return step1Schema
      case 2: return step2Schema
      case 3: return step3Schema
      case 4: return step4Schema
      case 5: return step5Schema
      default: return z.object({})
    }
  }

  const validateCurrentStep = async () => {
    const schema = getStepSchema(currentStep)
    const result = schema.safeParse(formData)
    if (!result.success) {
      const errors: Record<string, { message?: string }> = {}
      result.error.errors.forEach((err) => {
        errors[err.path.join('.')] = { message: err.message }
      })
      setStepErrors(errors)
      return false
    }
    setStepErrors({})
    return true
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    if (!isValid) return
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1)
      setStepErrors({})
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
      setStepErrors({})
    }
  }

  const handleSubmit = async () => {
    // Validate all steps
    for (let i = 0; i < STEPS.length; i++) {
      const schema = getStepSchema(i)
      const result = schema.safeParse(formData)
      if (!result.success) {
        setCurrentStep(i)
        const errors: Record<string, { message?: string }> = {}
        result.error.errors.forEach((err) => {
          errors[err.path.join('.')] = { message: err.message }
        })
        setStepErrors(errors)
        return
      }
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      // Prepare data for Supabase
      const submitData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        bio: formData.bio,
        city: formData.city,
        province: formData.province,
        profile_photo_url: formData.profile_photo_url || null,
        credentials: formData.credentials || [],
        availability_status: formData.availability_status || null,
        available_from_date: formData.available_from_date || null,
        notice_period: formData.notice_period || null,
        placement_types: formData.placement_types || [],
        client_preference: formData.client_preference || null,
        postal_code: formData.postal_code,
      }

      await createCaregiver(submitData)
      setSubmitSuccess(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className={cn('min-h-screen bg-[#FAFAF8] flex items-center justify-center p-6', inter.className)}>
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-[18px] font-black text-[#1A2B4A] mb-2">Profile submitted!</h2>
          <p className="text-[13px] text-[#4B5563]">
            Your caregiver profile has been created. Agencies and families can now discover you.
          </p>
        </Card>
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepIdentity
            register={() => ({})}
            formData={formData}
            setFormData={setFormData}
            errors={stepErrors}
          />
        )
      case 1:
        return (
          <StepServices
            formData={formData}
            setFormData={setFormData}
            errors={stepErrors}
          />
        )
      case 2:
        return (
          <StepAvailability
            formData={formData}
            setFormData={setFormData}
            errors={stepErrors}
          />
        )
      case 3:
        return (
          <StepCertifications
            formData={formData}
            setFormData={setFormData}
            errors={stepErrors}
          />
        )
      case 4:
        return (
          <StepBackground
            formData={formData}
            setFormData={setFormData}
          />
        )
      case 5:
        return (
          <StepReferences
            formData={formData}
            setFormData={setFormData}
            errors={stepErrors}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className={cn('min-h-screen bg-[#FAFAF8]', inter.className)}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[24px] font-black tracking-[-0.03em] text-[#1A2B4A]">
            Build your caregiver profile
          </h1>
          <p className="text-[13px] text-[#4B5563] mt-1">
            Complete all steps to get discovered by families and agencies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-3">
            {STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => step.index < currentStep && goToStep(step.index)}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl transition-all w-full text-left',
                  currentStep === step.index
                    ? 'bg-[#FEF3C7] border border-[#F59E0B]/30'
                    : '',
                  step.index < currentStep
                    ? 'hover:bg-white cursor-pointer'
                    : '',
                  step.index > currentStep
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                )}
                disabled={step.index > currentStep}
              >
                {step.index < currentStep ? (
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : currentStep === step.index ? (
                  <Circle className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                )}
                <div>
                  <div className="text-[13px] font-semibold text-[#1A1A1A]">{step.label}</div>
                  <div className="text-[12px] text-[#4B5563]">{step.desc}</div>
                </div>
              </button>
            ))}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full mt-4 text-[13px] font-bold px-6 py-3 rounded-xl text-[#1A1A1A] bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit profile →'
              )}
            </button>

            {submitError && (
              <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-600 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {submitError}
              </div>
            )}
          </aside>

          {/* Content */}
          <main>
            <Card>
              <CardContent className="p-8">
                {renderStep()}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-[rgba(26,43,74,0.08)]">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className={cn(
                      'text-[13px] font-bold px-6 py-3 rounded-xl border transition-all',
                      currentStep === 0
                        ? 'text-[#9CA3AF] border-[#E5E7EB] cursor-not-allowed'
                        : 'text-[#1A2B4A] border-[#1A2B4A]/20 hover:bg-[#1A2B4A]/5'
                    )}
                  >
                    ← Back
                  </button>

                  <div className="text-[12px] text-[#9CA3AF]">
                    Step {currentStep + 1} of {STEPS.length}
                  </div>

                  {currentStep < STEPS.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="text-[13px] font-bold px-6 py-3 rounded-xl text-[#1A1A1A] bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] hover:opacity-90 transition-opacity"
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="text-[13px] font-bold px-6 py-3 rounded-xl text-[#1A1A1A] bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit profile →'
                      )}
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}
