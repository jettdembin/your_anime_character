import OpenAI from 'openai';
 
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
 
export const runtime = 'edge'
 
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log(messages);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
    });

    // The completion object should already contain the necessary information
    return new Response(JSON.stringify(completion), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error:any) {
    console.error("Error in OpenAI API call:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}