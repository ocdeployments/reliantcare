import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      {/* Hero */}
      <section className="flex min-h-screen flex-col items-center justify-center bg-[#1A2B4A] px-6 text-center">
        <h1 className="text-4xl font-black tracking-[-0.03em] leading-[1.0] text-[#FAFAF8] sm:text-6xl">
          Reliable connections<br />between caregivers and agencies.
        </h1>
        <p className="mt-6 text-[15px] leading-[1.65] text-[#FAFAF8]/70 max-w-xl">
          ReliantCare builds verified, portable reputations for caregivers — so the good ones get found, fast.
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/sign-up"
            className="text-[13px] font-bold px-6 py-3 rounded-xl text-[#1A1A1A]"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)' }}
          >
            Get Started
          </Link>
          <Link
            href="/sign-in"
            className="text-[13px] font-bold px-6 py-3 rounded-xl text-[#FAFAF8] bg-[#FAFAF8]/[0.05] border border-[#FAFAF8]/[0.12] hover:bg-[#FAFAF8]/[0.08] transition-all"
          >
            Sign In
          </Link>
        </div>
      </section>
    </main>
  )
}
