// Netlify Function: handle waitlist form submission
// Receives: { email, source }
// Stores in: Supabase waitlist table
// Returns: { success: true } or { error: "..." }

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    }
  }

  const { email, source = 'unknown' } = body

  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'A valid email address is required.' }),
    }
  }

  // If Supabase is configured, insert into database
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          email,
          source,
          created_at: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        // Ignore duplicate key errors (already registered)
        if (!errorData.message?.includes('duplicate') && !errorData.code?.includes('23505')) {
          console.error('Supabase insert error:', errorData)
          return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to save your registration. Please try again.' }),
          }
        }
      }
    } catch (err) {
      console.error('Supabase network error:', err)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to connect to database. Please try again.' }),
      }
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  }
}
