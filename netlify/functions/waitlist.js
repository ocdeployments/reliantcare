// Netlify Function: handle waitlist form submission
// Stores: { email, source, created_at } → Supabase waitlist table

const SUPABASE_URL = 'https://ykvjdeqvxifxccdafxoq.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdmpkZXF2eGlmeGNjZGFmeG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MjczMDQsImV4cCI6MjA5MDUwMzMwNH0.btUHnIRy0SDZgC1SMXDLrXxLiyfzyE3ioxPFJ3M16wI'

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) }
  }

  const { email, source = 'unknown' } = body

  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'A valid email address is required.' }) }
  }

  // Insert into Supabase
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        email,
        source,
        created_at: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      // 23505 = unique constraint violation (already registered) — not an error
      if (errorData?.code === '23505' || errorData?.message?.includes('duplicate')) {
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, message: 'Already registered!' }),
        }
      }
      console.error('Supabase error:', errorData)
      return { statusCode: 500, body: JSON.stringify({ error: 'Could not save. Please try again.' }) }
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) }
  } catch (err) {
    console.error('Network error:', err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Connection error. Please try again.' }) }
  }
}
