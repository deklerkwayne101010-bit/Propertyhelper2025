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

    switch (req.method) {
      case 'GET': {
        // Get user's credit balance
        const { data, error } = await supabase
          .from('credits')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        // Calculate total balance
        const balance = data.reduce((total, credit) => {
          return credit.type === 'USAGE' ? total - credit.amount : total + credit.amount
        }, 0)

        return new Response(
          JSON.stringify({
            credits: data,
            balance: Math.max(0, balance)
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      case 'POST': {
        const { amount, type, description, transactionId } = await req.json()

        // Validate credit consumption
        if (type === 'USAGE') {
          const { data: credits } = await supabase
            .from('credits')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          const currentBalance = credits.reduce((total, credit) => {
            return credit.type === 'USAGE' ? total - credit.amount : total + credit.amount
          }, 0)

          if (currentBalance < amount) {
            return new Response(
              JSON.stringify({ error: 'Insufficient credits' }),
              {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
              }
            )
          }
        }

        const { data, error } = await supabase
          .from('credits')
          .insert({
            amount,
            type,
            description,
            user_id: user.id,
            transaction_id: transactionId,
          })
          .select()
          .single()

        if (error) throw error

        return new Response(
          JSON.stringify({ credit: data }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 201,
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