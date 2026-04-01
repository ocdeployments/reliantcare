import { NextResponse } from 'next/server'

export async function GET() {
  const start = Date.now()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({
      status: 'configured',
      timestamp: new Date().toISOString(),
      database: 'pending',
      responseTime: `${Date.now() - start}ms`,
      note: 'Supabase env vars not yet set',
    })
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    await supabase.from('caregivers').select('count').limit(1)
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      responseTime: `${Date.now() - start}ms`,
    })
  } catch {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'error',
    }, { status: 500 })
  }
}
