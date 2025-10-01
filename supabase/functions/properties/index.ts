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
        if (id && id !== 'properties') {
          // Get single property
          const { data, error } = await supabase
            .from('properties')
            .select(`
              *,
              images:property_images(*),
              documents:property_documents(*),
              user:users(id, first_name, last_name, email)
            `)
            .eq('id', id)
            .single()

          if (error) throw error

          return new Response(
            JSON.stringify({ property: data }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          )
        } else {
          // Get all properties for user
          const { data, error } = await supabase
            .from('properties')
            .select(`
              *,
              images:property_images(*),
              documents:property_documents(*)
            `)
            .order('created_at', { ascending: false })

          if (error) throw error

          return new Response(
            JSON.stringify({ properties: data }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          )
        }
      }

      case 'POST': {
        const body = await req.json()
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

        const { data, error } = await supabase
          .from('properties')
          .insert({
            ...body,
            user_id: user.id,
          })
          .select()
          .single()

        if (error) throw error

        return new Response(
          JSON.stringify({ property: data }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 201,
          }
        )
      }

      case 'PUT': {
        if (!id || id === 'properties') {
          return new Response(
            JSON.stringify({ error: 'Property ID required' }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          )
        }

        const body = await req.json()
        const { data, error } = await supabase
          .from('properties')
          .update(body)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error

        return new Response(
          JSON.stringify({ property: data }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      case 'DELETE': {
        if (!id || id === 'properties') {
          return new Response(
            JSON.stringify({ error: 'Property ID required' }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          )
        }

        const { error } = await supabase
          .from('properties')
          .delete()
          .eq('id', id)

        if (error) throw error

        return new Response(
          JSON.stringify({ message: 'Property deleted successfully' }),
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