import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
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

    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()

    switch (req.method) {
      case 'GET': {
        if (id && id !== 'templates') {
          // Get single template
          const { data, error } = await supabase
            .from('templates')
            .select(`
              *,
              user:users(id, first_name, last_name)
            `)
            .eq('id', id)
            .single()

          if (error) throw error

          return new Response(
            JSON.stringify({ template: data }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          )
        } else {
          // Get all templates (public + user's own)
          const { data: { user } } = await supabase.auth.getUser()

          let query = supabase
            .from('templates')
            .select(`
              *,
              user:users(id, first_name, last_name)
            `)
            .order('created_at', { ascending: false })

          if (user) {
            // Include user's private templates
            query = query.or(`is_public.eq.true,user_id.eq.${user.id}`)
          } else {
            // Only public templates for non-authenticated users
            query = query.eq('is_public', true)
          }

          const { data, error } = await query

          if (error) throw error

          return new Response(
            JSON.stringify({ templates: data }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          )
        }
      }

      case 'POST': {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          return new Response(
            JSON.stringify({ error: 'Unauthorized' }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 401,
            }
          )
        }

        const body = await req.json()
        const { data, error } = await supabase
          .from('templates')
          .insert({
            ...body,
            user_id: user.id,
          })
          .select()
          .single()

        if (error) throw error

        return new Response(
          JSON.stringify({ template: data }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 201,
          }
        )
      }

      case 'PUT': {
        if (!id || id === 'templates') {
          return new Response(
            JSON.stringify({ error: 'Template ID required' }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          )
        }

        const body = await req.json()
        const { data, error } = await supabase
          .from('templates')
          .update(body)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error

        return new Response(
          JSON.stringify({ template: data }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      case 'DELETE': {
        if (!id || id === 'templates') {
          return new Response(
            JSON.stringify({ error: 'Template ID required' }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          )
        }

        const { error } = await supabase
          .from('templates')
          .delete()
          .eq('id', id)

        if (error) throw error

        return new Response(
          JSON.stringify({ message: 'Template deleted successfully' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 405,
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