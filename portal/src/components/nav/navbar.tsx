'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/for-caregivers', label: 'For Caregivers' },
  { href: '/for-agencies', label: 'For Agencies' },
  { href: '/for-families', label: 'For Families' },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#FAFAF8]/[0.9] backdrop-blur-sm border-b border-[rgba(26,43,74,0.08)]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[18px] font-black tracking-[-0.02em] text-[#1A2B4A]">ReliantCare</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-[13px] font-semibold transition-colors',
                pathname === link.href ? 'text-[#1A2B4A]' : 'text-[#4B5563] hover:text-[#1A2B4A]'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/sign-in">
            <Button variant="ghostDark" size="sm">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button
              size="sm"
              className="text-[13px] font-bold px-6 py-3 rounded-xl text-[#1A1A1A]"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)' }}
            >
              Get Started
            </Button>
          </Link>
        </div>

        <button
          className="flex items-center justify-center md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-[#1A2B4A]" />
          ) : (
            <Menu className="h-5 w-5 text-[#1A2B4A]" />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-[rgba(26,43,74,0.08)] bg-[#FAFAF8] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] font-semibold text-[#1A2B4A]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-[rgba(26,43,74,0.08)]">
              <Link href="/sign-in">
                <Button variant="ghostDark" className="w-full justify-center">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  className="w-full justify-center text-[13px] font-bold px-6 py-3 rounded-xl text-[#1A1A1A]"
                  style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)' }}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
