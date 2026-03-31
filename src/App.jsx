import { useState, useEffect, useRef } from 'react'
import {
  XCircle,
  Users,
  TrendingDown,
  ShieldCheck,
  Star,
  Briefcase,
  ChevronDown,
  Check,
  Lock,
  ArrowRight,
  Quote,
} from 'lucide-react'

// ──────────────────────────────────────────────
// SIMPLE ROUTER
// ──────────────────────────────────────────────
function useRouter() {
  const [page, setPage] = useState(window.location.pathname)
  useEffect(() => {
    const handleNavigate = () => setPage(window.location.pathname)
    window.addEventListener('navigate', handleNavigate)
    return () => window.removeEventListener('navigate', handleNavigate)
  }, [])
  const navigate = (path) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new Event('navigate'))
  }
  return { page, navigate }
}

// ──────────────────────────────────────────────
// NAVIGATION
// ──────────────────────────────────────────────
function Nav({ onJoinClick }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-xl font-extrabold text-navy tracking-tight">ReliantCare Network</a>
        <button
          onClick={onJoinClick}
          className="bg-amber text-navy font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-amber-dark transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          Join Waitlist
        </button>
      </div>
    </nav>
  )
}

// ──────────────────────────────────────────────
// EMAIL FORM
// ──────────────────────────────────────────────
function EmailForm({ variant = 'default', buttonText = "Build My Portfolio — Free to Start", id }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef(null)

  const validate = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate(email)) {
      setStatus('error')
      setErrorMsg('Please enter a valid email address.')
      inputRef.current?.focus()
      return
    }
    setStatus('loading')
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'landing_page' }),
      })
      if (response.ok) {
        setStatus('success')
      } else {
        const data = await response.json()
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please check your connection and try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 justify-center animate-fade-in">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <Check className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="text-navy font-semibold text-base">You're on the list.</p>
          <p className="text-gray-500 text-sm">We'll be in touch when early access opens.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mx-auto"
        id={id}
        name="waitlist"
        data-netlify="true"
      >
        <input type="hidden" name="form-name" value="waitlist" />
        <input
          ref={inputRef}
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          placeholder="Your email address"
          className={`flex-1 h-14 px-5 rounded-xl border-2 text-base text-navy placeholder:text-gray-400 outline-none transition-all duration-200 bg-white ${
            status === 'error' ? 'border-red-400 focus:border-red-500' : 'border-border focus:border-navy'
          }`}
          disabled={status === 'loading'}
          autoComplete="email"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="h-14 px-8 bg-amber text-navy font-extrabold text-base rounded-xl hover:bg-amber-dark transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
        >
          {status === 'loading' ? (
            <span className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
          ) : buttonText}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-red-500 text-sm mt-2 text-center">{errorMsg}</p>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────
// SECTION LABELS
// ──────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p className="text-amber font-semibold text-sm tracking-widest uppercase mb-4">
      {children}
    </p>
  )
}

// ──────────────────────────────────────────────
// HERO
// ──────────────────────────────────────────────
function Hero({ onJoinClick }) {
  return (
    <section className="pt-40 pb-24 px-6 bg-bg">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-amber-light text-amber-dark text-sm font-semibold px-4 py-1.5 rounded-full mb-8 animate-fade-up opacity-0" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
          <span className="w-1.5 h-1.5 bg-amber-dark rounded-full" />
          Now accepting early waitlist
        </div>

        <h1 className="text-display-xs sm:text-display-sm md:text-display font-extrabold text-navy leading-[1.1] tracking-tight mb-6 animate-fade-up opacity-0" style={{ animationDelay: '80ms', animationFillMode: 'forwards' }}>
          Don't start<br className="hidden sm:block" /> from zero again.
        </h1>

        <p className="text-lg sm:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-up opacity-0" style={{ animationDelay: '160ms', animationFillMode: 'forwards' }}>
          ReliantCare Network builds your verified, portable career portfolio — free to start. Credentials, work history, and a reliability score that travels with you and opens doors to better opportunities.
        </p>

        <div className="animate-fade-up opacity-0" style={{ animationDelay: '240ms', animationFillMode: 'forwards' }}>
          <EmailForm buttonText="Build My Portfolio — Free to Start" />
          <p className="flex items-center justify-center gap-1.5 text-sm text-gray-400 mt-4">
            <Lock className="w-3.5 h-3.5" />
            No credit card. No catch. Free to start.
          </p>
        </div>

        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div
            className="absolute top-20 left-1/2 -translate-x-1/2 opacity-[0.035]"
            style={{
              backgroundImage: 'radial-gradient(#1A2B4A 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              width: '120vw',
              height: '600px',
            }}
          />
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// PROBLEM SECTION
// ──────────────────────────────────────────────
const problems = [
  {
    icon: XCircle,
    title: 'You start from zero every time',
    desc: "Every new agency asks you to re-upload every credential, re-verify every reference. Even if you've been doing this for 10 years.",
  },
  {
    icon: Users,
    title: "Your reputation lives in someone else's file",
    desc: 'Your shift history, your reliability record, your family ratings — none of it follows you when you leave. The agency owns it. You do not.',
  },
  {
    icon: TrendingDown,
    title: 'The good ones leave. You know why.',
    desc: 'Caregivers quit not because of the work — but because the system does not respect what they have built. It all disappears at the door.',
  },
]

function ProblemSection() {
  return (
    <section className="py-24 px-6 bg-white border-y border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionLabel>The problem</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy leading-tight">
            The caregiving industry runs on gut feel.<br />And caregivers pay the price.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <div
              key={i}
              className="reveal rounded-2xl border border-border p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-amber-light flex items-center justify-center mb-5 group-hover:bg-amber/20 transition-colors">
                <p.icon className="w-6 h-6 text-amber" />
              </div>
              <h3 className="text-lg font-bold text-navy mb-3">{p.title}</h3>
              <p className="text-gray-500 leading-relaxed text-[15px]">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// SOLUTION SECTION
// ──────────────────────────────────────────────
const features = [
  {
    icon: ShieldCheck,
    title: 'Verified credentials. Uploaded once.',
    desc: 'PSW certification, CPR, TB test, vulnerable sector check — uploaded once, confirmed by agencies, yours forever.',
  },
  {
    icon: Star,
    title: 'A score built from real work',
    desc: "Your reliability and care rating are verified by the agencies you have worked with — and the families you have cared for. Not self-reported. Not gameable.",
  },
  {
    icon: Briefcase,
    title: 'Your work history. Not a resume.',
    desc: 'Every shift logged, every engagement rated, every reference named. A complete picture of who you are as a caregiver — built by the people who actually worked with you.',
  },
]

function SolutionSection() {
  return (
    <section className="py-24 px-6 bg-bg">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel>What we built</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy leading-tight mb-10">
              The first reputation system<br />built for caregivers.
            </h2>
            <div className="flex flex-col gap-8">
              {features.map((f, i) => (
                <div key={i} className="reveal flex gap-5">
                  <div className="w-12 h-12 rounded-xl bg-amber-light flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-5 h-5 text-amber" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy mb-1.5">{f.title}</h3>
                    <p className="text-gray-500 leading-relaxed text-[15px]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal flex justify-center lg:justify-end">
            <div className="bg-white rounded-2xl border border-border shadow-xl p-8 w-full max-w-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-navy flex items-center justify-center text-white font-extrabold text-lg">MT</div>
                <div>
                  <p className="font-bold text-navy">Maria T.</p>
                  <p className="text-sm text-gray-400">PSW · Ottawa, ON</p>
                </div>
                <div className="ml-auto bg-green-50 border border-green-200 rounded-full px-3 py-1">
                  <p className="text-xs font-bold text-green-600">Verified</p>
                </div>
              </div>
              <div className="bg-bg-alt rounded-xl p-4 mb-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-navy">Reliability Score</p>
                  <p className="text-lg font-extrabold text-amber">4.8</p>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber rounded-full" style={{ width: '96%' }} />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Based on 214 confirmed shifts</p>
              </div>
              <div className="space-y-2.5 mb-5">
                {['PSW Certification ✓', 'CPR/AED ✓', 'TB Test ✓', 'Vulnerable Sector ✓'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-navy">
                    <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Confirmed by</p>
                <div className="flex gap-2 flex-wrap">
                  {['Bayshore', 'SE Health', 'CBI'].map((name) => (
                    <span key={name} className="text-xs bg-bg-alt border border-border text-navy px-2.5 py-1 rounded-lg font-medium">{name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// HOW IT WORKS
// ──────────────────────────────────────────────
const steps = [
  {
    num: '01',
    title: 'Build your portfolio',
    desc: "Tell us who you are, what you have done, and upload your credentials. Takes about 10 minutes.",
  },
  {
    num: '02',
    title: 'Agencies confirm your history',
    desc: 'Every agency you work with verifies your shift history and adds their rating. Over time, your portfolio becomes undeniable.',
  },
  {
    num: '03',
    title: 'Better opportunities find you',
    desc: 'Share one link with any agency. Your verified portfolio speaks for itself — better roles, better pay, better fits.',
  },
]

function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy leading-tight">
            Three steps. Ten minutes.<br />Yours forever.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="reveal relative">
              {i < 2 && <div className="hidden md:block absolute top-10 left-[calc(50%+32px)] right-[calc(-50%+32px)] h-px bg-border z-0" />}
              <div className="relative z-10 flex flex-col items-start">
                <span className="text-5xl font-extrabold text-amber mb-5">{s.num}</span>
                <h3 className="text-xl font-bold text-navy mb-3">{s.title}</h3>
                <p className="text-gray-500 leading-relaxed text-[15px]">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// SOCIAL PROOF
// ──────────────────────────────────────────────
function SocialProof() {
  return (
    <section className="py-24 px-6 bg-bg-alt">
      <div className="max-w-3xl mx-auto text-center">
        <Quote className="w-10 h-10 text-amber mx-auto mb-8 opacity-60" />
        <blockquote className="text-2xl sm:text-3xl font-medium text-navy leading-relaxed mb-8 italic">
          "I've been a PSW for 7 years. Every time I switched agencies, I lost everything — my standing, my references, my history. I had to prove myself from scratch every single time. This is the first thing that's actually for us."
        </blockquote>
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white text-sm font-bold">MT</div>
          <div className="text-left">
            <p className="font-semibold text-navy text-sm">Maria T.</p>
            <p className="text-gray-400 text-sm">PSW, Ottawa</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// FOR AGENCIES
// ──────────────────────────────────────────────
function ForAgencies({ onJoinClick }) {
  return (
    <section className="py-24 px-6 bg-navy">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel><span className="text-amber/80">For home care agencies</span></SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-6">
              Stop hiring blind.<br />Start hiring proven.
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4 text-lg">
              ReliantCare Network gives your agency a verified pool of pre-screened caregivers. You see real shift history, real reliability scores, and real feedback — before you make an offer.
            </p>
            <p className="text-gray-400 leading-relaxed mb-10">
              Our AI recruiting agent handles the screening and scheduling so you are not losing hours to phone tag.
            </p>
            <button
              onClick={onJoinClick}
              className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white hover:text-navy transition-all duration-200"
            >
              Agency? Get early access
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {[
              { stat: '60–75%', label: 'Annual caregiver turnover rate' },
              { stat: '$2,600–$5,000', label: 'Cost to replace one caregiver' },
              { stat: '50%', label: 'Of scheduled interviews are no-shows' },
              { stat: '3–6 weeks', label: 'Average time-to-hire in home care' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <p className="text-3xl font-extrabold text-amber mb-2">{item.stat}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// FAQ
// ──────────────────────────────────────────────
const faqs = [
  {
    q: 'Is this really free for caregivers?',
    a: "Yes. Caregivers get a free portfolio to start. No credit card, no tiered plan, no catch. Agencies pay for access to the recruiting and screening tools — that's what keeps it free for caregivers.",
  },
  {
    q: 'How is my reputation verified?',
    a: 'Your portfolio is built from data confirmed by the agencies you have worked with — not self-reported claims. The more agencies that confirm your history, the stronger your portfolio becomes.',
  },
  {
    q: 'Who owns my data?',
    a: 'You do. Your portfolio, your history, your ratings — all yours. You control what gets shared and with whom. We never sell your data.',
  },
  {
    q: 'Does this work across different agencies?',
    a: 'Yes. Your portfolio works with any agency on the platform — in any city. Move from Ottawa to Toronto, your reputation moves with you.',
  },
  {
    q: 'When does this launch?',
    a: 'We are building now. Early access opens to caregivers in Ontario first, then expands across Canada and into the US. Join the waitlist and we will tell you first.',
  },
  {
    q: 'What about family privacy?',
    a: "Family ratings are shared with your consent and are tied to your caregiver portfolio — not to the family's personal information. We do not store medical data, address, or anything beyond your caregiving history.",
  },
]

function FAQ() {
  const [open, setOpen] = useState(null)
  return (
    <section className="py-24 px-6 bg-bg">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <SectionLabel>Questions</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy">The important stuff.</h2>
        </div>
        <div className="divide-y divide-border">
          {faqs.map((faq, i) => (
            <div key={i} className="py-5">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-start justify-between gap-4 text-left group"
              >
                <span className={`font-semibold text-base transition-colors ${open === i ? 'text-navy' : 'text-gray-700 group-hover:text-navy'}`}>
                  {faq.q}
                </span>
                <ChevronDown className={`w-5 h-5 flex-shrink-0 mt-0.5 text-gray-400 transition-transform duration-200 ${open === i ? 'rotate-180 text-amber' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${open === i ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-500 leading-relaxed text-[15px]">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// FINAL CTA
// ──────────────────────────────────────────────
function FinalCTA({ onJoinClick }) {
  return (
    <section className="py-24 px-6 bg-white border-t border-border">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-navy leading-tight mb-4">
          The industry's been asking<br />for this for years.
        </h2>
        <p className="text-xl text-amber font-semibold mb-10">Be first.</p>
        <EmailForm buttonText="Build My Portfolio — Free to Start" id="final-cta" />
        <div className="flex items-center justify-center gap-2 mt-4">
          <Lock className="w-3.5 h-3.5 text-gray-400" />
          <p className="text-sm text-gray-400">No credit card. No catch. Free forever.</p>
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// FOOTER
// ──────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-navy py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-white font-extrabold text-lg">ReliantCare Network</p>
          <p className="text-gray-400 text-sm mt-0.5">Built for caregivers. Free forever.</p>
        </div>
        <div className="flex items-center gap-6">
          <a href="/privacy.html" className="text-gray-400 text-sm hover:text-white transition-colors">Privacy Policy</a>
          <p className="text-gray-500 text-sm">© 2026 ReliantCare Network</p>
        </div>
      </div>
    </footer>
  )
}

// ──────────────────────────────────────────────
// INTERSECTION OBSERVER HOOK
// ──────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

// ──────────────────────────────────────────────
// PRIVACY PAGE
// ──────────────────────────────────────────────
function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-extrabold text-navy tracking-tight">ReliantCare Network</a>
          <a href="/" className="text-sm text-gray-500 hover:text-navy transition-colors">← Back to home</a>
        </div>
      </nav>
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-gray-400 mb-4">Last updated: March 31, 2026</p>
          <h1 className="text-4xl font-extrabold text-navy mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-500 leading-relaxed mb-12">
            ReliantCare Network ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains what data we collect, how we use it, and what rights you have.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
            {[
              { label: 'Your data stays yours', desc: 'We never sell your information', Icon: Lock },
              { label: 'No medical data', desc: "We don't collect health records", Icon: Shield },
              { label: 'Delete anytime', desc: 'Request deletion at any time', Icon: Trash2 },
            ].map(({ label, desc, Icon }, i) => (
              <div key={i} className="bg-white border border-border rounded-xl p-5">
                <Icon className="w-5 h-5 text-amber mb-3" />
                <p className="font-semibold text-navy text-sm mb-1">{label}</p>
                <p className="text-gray-400 text-xs">{desc}</p>
              </div>
            ))}
          </div>
          {[
            {
              title: 'What we collect',
              icon: Shield,
              body: (
                <>
                  <p className="text-gray-600 text-[15px] leading-relaxed">When you join the ReliantCare Network waitlist, we collect:</p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600 text-[15px] mt-3">
                    <li><strong>Email address</strong> — to notify you when early access opens</li>
                    <li><strong>How you found us</strong> — so we know which channels are working</li>
                    <li><strong>Device and browser information</strong> — collected automatically to help us improve the site</li>
                  </ul>
                  <p className="text-gray-600 text-[15px] leading-relaxed mt-3">We do <strong>not</strong> collect: health records, government IDs, financial information, or any medical or care-related personal data.</p>
                </>
              ),
            },
            {
              title: 'How we use your data',
              icon: Users,
              body: (
                <>
                  <p className="text-gray-600 text-[15px] leading-relaxed">We use your information to:</p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600 text-[15px] mt-3">
                    <li>Notify you when ReliantCare Network early access is available</li>
                    <li>Understand how many people are interested in the platform</li>
                    <li>Improve the waitlist experience and future product</li>
                    <li>Send occasional updates about the platform progress (no more than 1-2 per month)</li>
                  </ul>
                  <p className="text-gray-600 text-[15px] leading-relaxed mt-3">We <strong>never</strong> use your data for advertising, sell it to third parties, or share it with agencies or other users without your explicit consent.</p>
                </>
              ),
            },
            {
              title: 'Cookies',
              icon: Clock,
              body: (
                <p className="text-gray-600 text-[15px] leading-relaxed">
                  We use minimal cookies — only what is necessary to keep the site functional and measure basic traffic. We do not use tracking cookies, advertising cookies, or any form of cross-site tracking. When we launch the full platform, we will update this policy and ask for your consent before setting any non-essential cookies.
                </p>
              ),
            },
            {
              title: 'Data retention',
              icon: Mail,
              body: (
                <>
                  <p className="text-gray-600 text-[15px] leading-relaxed">
                    Waitlist data is retained until you either unsubscribe or request deletion. You can ask us to delete your data at any time — no questions asked.
                  </p>
                  <p className="text-gray-600 text-[15px] leading-relaxed mt-3">
                    When the full platform launches, we will provide full data export and deletion tools directly in your account settings.
                  </p>
                </>
              ),
            },
            {
              title: 'Platform-specific data (when launched)',
              icon: Shield,
              body: (
                <>
                  <p className="text-gray-600 text-[15px] leading-relaxed">
                    When the full ReliantCare Network platform launches, we will collect additional information to power the reputation system:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600 text-[15px] mt-3">
                    <li><strong>Caregiver profiles</strong> — name, credentials, work history, city, availability</li>
                    <li><strong>Ratings and reviews</strong> — submitted by agencies and families</li>
                    <li><strong>Shift data</strong> — shift completion, punctuality, engagement history (from agencies)</li>
                    <li><strong>Credential documents</strong> — uploaded once, verified by agencies, never shared publicly</li>
                  </ul>
                  <p className="text-gray-600 text-[15px] leading-relaxed mt-3">
                    All platform data is encrypted in transit and at rest. Caregiver data is only visible to agencies you choose to share it with. Family ratings are shared only with your consent and are never tied to your personal identity.
                  </p>
                </>
              ),
            },
            {
              title: 'Your rights',
              icon: Lock,
              body: (
                <>
                  <p className="text-gray-600 text-[15px] leading-relaxed">You have the right to:</p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600 text-[15px] mt-3">
                    <li>Know what data we have about you</li>
                    <li>Request deletion of your data at any time</li>
                    <li>Opt out of any communications at any time</li>
                    <li>Correct any inaccurate information</li>
                  </ul>
                  <p className="text-gray-600 text-[15px] leading-relaxed mt-3">To exercise any of these rights, email <strong>privacy@reliantcare.network</strong>. We will respond within 48 hours.</p>
                </>
              ),
            },
            {
              title: 'Contact',
              icon: Mail,
              body: (
                <p className="text-gray-600 text-[15px] leading-relaxed">
                  Questions about this policy or your data?<br />
                  <strong>Email:</strong> privacy@reliantcare.network<br />
                  <strong>Website:</strong> https://reliantcare.netlify.app
                </p>
              ),
            },
          ].map(({ title, icon: Icon, body }, i) => (
            <div key={i} className="border-t border-border pt-8">
              <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
                <span className="text-amber"><Icon className="w-4 h-4" /></span>
                {title}
              </h2>
              {body}
            </div>
          ))}
          <div className="border-t border-border mt-8 pt-8">
            <p className="text-gray-400 text-sm leading-relaxed">
              We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email (if you are on the waitlist) and update the "Last updated" date above.
            </p>
          </div>
        </div>
      </main>
      <footer className="bg-navy py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white font-extrabold text-base">ReliantCare Network</p>
          <p className="text-gray-400 text-sm mt-1">Built for caregivers. Free forever.</p>
        </div>
      </footer>
    </div>
  )
}

// ──────────────────────────────────────────────
// APP ROOT
// ──────────────────────────────────────────────
export default function App() {
  const { page, navigate } = useRouter()
  useReveal()

  const scrollToForm = () => {
    navigate('/')
    setTimeout(() => {
      document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 50)
  }

  if (page === '/privacy') {
    return <PrivacyPage />
  }

  return (
    <div className="min-h-screen bg-bg font-sans">
      <Nav onJoinClick={scrollToForm} />
      <Hero onJoinClick={scrollToForm} />
      <ProblemSection />
      <SolutionSection />
      <HowItWorks />
      <SocialProof />
      <ForAgencies onJoinClick={scrollToForm} />
      <FAQ />
      <FinalCTA onJoinClick={scrollToForm} />
      <Footer />
    </div>
  )
}
