const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { message } = JSON.parse(event.body);

    // Initialize Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Fetch personal data
    const { data: personalData, error: fetchError } = await supabase
      .from('personal_data')
      .select('key, value');

    if (fetchError) {
      throw new Error(`Supabase fetch error: ${fetchError.message}`);
    }

    // Construct context
    const contextInfo = personalData
      .map(item => `${item.key}: ${item.value}`)
      .join('\n');

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Generate response
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are Anthony's personal AI assistant. You know everything about Anthony from the following information. Answer questions naturally, personally, and helpfully. If asked about something not in the data, say you don't have that information.\n\n${contextInfo}`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 200,
    });

    const reply = completion.choices[0].message.content.trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};