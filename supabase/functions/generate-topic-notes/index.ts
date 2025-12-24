import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic } = await req.json();
    
    if (!topic || typeof topic !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Topic is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating notes for topic: ${topic}`);

    const systemPrompt = `You are an expert programming and technology tutor. Generate comprehensive, beginner-friendly learning notes for the given topic.

Your response MUST be a valid JSON object with exactly this structure:
{
  "notes": "markdown formatted notes here",
  "videos": [
    { "title": "Video Title 1", "searchQuery": "youtube search query 1" },
    { "title": "Video Title 2", "searchQuery": "youtube search query 2" },
    { "title": "Video Title 3", "searchQuery": "youtube search query 3" },
    { "title": "Video Title 4", "searchQuery": "youtube search query 4" }
  ]
}

The "notes" field should contain well-structured markdown with these sections:
## Introduction
Brief overview of what this topic is and why it matters.

## Key Concepts
List the core ideas with clear explanations.

## How It Works
Detailed explanation with examples.

## Code Examples
Practical code snippets with comments explaining each part.

## Common Use Cases
Real-world applications of this concept.

## Practice Problems
3 practice problems for the learner to try.

The "videos" array should contain 4 objects with YouTube search queries that would find helpful tutorials on this topic.

IMPORTANT: Return ONLY the JSON object, no markdown code blocks, no extra text.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate comprehensive learning notes for: ${topic}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add more credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to generate notes' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in AI response:', data);
      return new Response(
        JSON.stringify({ error: 'No response from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('AI response received, parsing...');

    // Parse the JSON response
    let parsedContent;
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();
      
      parsedContent = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError, 'Content:', content);
      // Fallback: use the content as notes directly
      parsedContent = {
        notes: content,
        videos: [
          { title: `${topic} Tutorial for Beginners`, searchQuery: `${topic} tutorial for beginners` },
          { title: `${topic} Crash Course`, searchQuery: `${topic} crash course` },
          { title: `${topic} Explained Simply`, searchQuery: `${topic} explained simply` },
          { title: `Advanced ${topic}`, searchQuery: `advanced ${topic} tutorial` }
        ]
      };
    }

    console.log('Successfully generated notes for:', topic);

    return new Response(
      JSON.stringify(parsedContent),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-topic-notes:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
