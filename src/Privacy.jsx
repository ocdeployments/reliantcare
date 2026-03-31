import { Lock, Shield, Users, Mail, Clock, Trash2 } from 'lucide-react'
import Nav from './Nav'

const lastUpdated = 'March 31, 2026'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-bg font-sans">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-extrabold text-navy tracking-tight">ReliantCare</span>
          <a
            href="/"
            className="text-sm text-gray-500 hover:text-navy transition-colors"
          >
            ← Back to home
          </a>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-gray-400 mb-4">Last updated: {lastUpdated}</p>
          <h1 className="text-4xl font-extrabold text-navy mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-500 leading-relaxed mb-12">
            ReliantCare Network ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains what data we collect, how we use it, and what rights you have.
          </p>

          {/* Quick summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
            {[
              { icon: Lock, label: 'Your data stays yours', desc: 'We never sell your information' },
              { icon: Shield, label: 'No medical data', desc: 'We don\'t collect health records' },
              { icon: Trash2, label: 'Delete anytime', desc: 'Request account deletion at any time' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-border rounded-xl p-5">
                <item.icon className="w-5 h-5 text-amber mb-3" />
                <p className="font-semibold text-navy text-sm mb-1">{item.icon === Lock ? 'Your data stays yours' : item.icon === Shield ? 'No medical data' : 'Delete anytime'}</p>
                <p className="text-gray-400 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="space-y-10">
            <Section
              title="What we collect"
              icon={<Shield className="w-4 h-4" />}
            >
              <p className="text-gray-600 leading-relaxed text-[15px]">
                When you join the ReliantCare waitlist, we collect:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-[15px] mt-3">
                <li><strong>Email address</strong> — to notify you when early access opens</li>
                <li><strong>How you found us</strong> — so we know which channels are working</li>
                <li><strong>Device and browser information</strong> — collected automatically to help us improve the site</li>
              </ul>
              <p className="text-gray-600 leading-relaxed text-[15px] mt-3">
                We do <strong>not</strong> collect: health records, government IDs, financial information, or any medical or care-related personal data.
              </p>
            </Section>

            <Section
              title="How we use your data"
              icon={<Users className="w-4 h-4" />}
            >
              <p className="text-gray-600 leading-relaxed text-[15px]">
                We use your information to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-[15px] mt-3">
                <li>Notify you when ReliantCare early access is available</li>
                <li>Understand how many people are interested in the platform</li>
                <li>Improve the waitlist experience and future product</li>
                <li>Send occasional updates about the platform's progress (no more than 1-2 per month)</li>
              </ul>
              <p className="text-gray-600 leading-relaxed text-[15px] mt-3">
                We <strong>never</strong> use your data for advertising, sell it to third parties, or share it with agencies or other users without your explicit consent.
              </p>
            </Section>

            <Section
              title="Cookies"
              icon={<Clock className="w-4 h-4" />}
            >
              <p className="text-gray-600 leading-relaxed text-[15px]">
                We use minimal cookies — only what's necessary to keep the site functional and measure basic traffic. We don't use tracking cookies, advertising cookies, or any form of cross-site tracking.
              </p>
              <p className="text-gray-600 leading-relaxed text-[15px] mt-3">
                When we launch the full platform, we'll update this policy and ask for your consent before setting any non-essential cookies.
              </p>
            </Section>

            <Section
              title="Data retention"
              icon={<Mail className="w-4 h-4" />}
            >
              <p className="text-gray-600 leading-relaxed text-[15px]">
                Waitlist data is retained until you either unsubscribe or request deletion. You can ask us to delete your data at any time — no questions asked. Email us at <strong>privacy@reliantcare.network</strong>.
              </p>
              <p className="text-gray-600 leading-relaxed text-[15px] mt-3">
                When the full platform launches, we'll provide full data export and deletion tools directly in your account settings.
              </p>
            </Section>

            <Section
              title="Platform-specific data (when launched)"
              icon={<Shield className="w-4 h-4" />}
            >
              <p className="text-gray-600 leading-relaxed text-[15px]">
                When the full ReliantCare platform launches, we'll collect additional information to power the reputation system:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-[15px] mt-3">
                <li><strong>Caregiver profiles</strong> — name, credentials, work history, city, availability</li>
                <li><strong>Ratings and reviews</strong> — submitted by agencies and families</li>
                <li><strong>Shift data</strong> — shift completion, punctuality, engagement history (from agencies)</li>
                <li><strong>Credential documents</strong> — uploaded once, verified by agencies, never shared publicly</li>
              </ul>
              <p className="text-gray-600 leading-relaxed text-[15px] mt-3">
                All platform data is encrypted in transit and at rest. Caregiver data is only visible to agencies you choose to share it with. Family ratings are shared only with your consent and are never tied to your personal identity.
              </p>
            </Section>

            <Section
              title="Your rights"
              icon={<Lock className="w-4 h-4" />}
            >
              <p className="text-gray-600 leading-relaxed text-[15px]">
                You have the right to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-[15px] mt-3">
                <li>Know what data we have about you</li>
                <li>Request deletion of your data at any time</li>
                <li>Opt out of any communications at any time</li>
                <li>Correct any inaccurate information</li>
              </ul>
              <p className="text-gray-600 leading-relaxed text-[15px] mt-3">
                To exercise any of these rights, email <strong>privacy@reliantcare.network</strong>. We'll respond within 48 hours.
              </p>
            </Section>

            <Section
              title="Contact"
              icon={<Mail className="w-4 h-4" />}
            >
              <p className="text-gray-600 leading-relaxed text-[15px]">
                Questions about this policy or your data?
              </p>
              <p className="text-gray-600 leading-relaxed text-[15px] mt-2">
                <strong>Email:</strong> privacy@reliantcare.network<br />
                <strong>Website:</strong> https://reliantcare.netlify.app
              </p>
            </Section>

            <div className="border-t border-border pt-8">
              <p className="text-gray-400 text-sm leading-relaxed">
                We may update this Privacy Policy from time to time. If we make material changes, we'll notify you by email (if you're on the waitlist) and update the "Last updated" date above.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-navy py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white font-extrabold text-base">ReliantCare</p>
          <p className="text-gray-400 text-sm mt-1">Built for caregivers. Free forever.</p>
        </div>
      </footer>
    </div>
  )
}

function Section({ title, icon, children }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
        <span className="text-amber">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  )
}
