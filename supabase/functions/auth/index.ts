import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { action } = await req.json()

    switch (action) {
      case 'signin': {
        const { email, password } = await req.json()
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        return new Response(
          JSON.stringify({ user: data.user, session: data.session }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      case 'signup': {
        const { email, password, firstName, lastName, phone } = await req.json()
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              phone: phone,
            }
          }
        })

        if (error) throw error

        return new Response(
          JSON.stringify({ user: data.user, session: data.session }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      case 'signout': {
        const { error } = await supabase.auth.signOut()
        if (error) throw error

        return new Response(
          JSON.stringify({ message: 'Signed out successfully' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      case 'reset-password': {
        const { email } = await req.json()
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${Deno.env.get('FRONTEND_URL')}/reset-password`,
        })

        if (error) throw error

        return new Response(
          JSON.stringify({ message: 'Password reset email sent' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      case 'get-user': {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error

        return new Response(
          JSON.stringify({ user }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})