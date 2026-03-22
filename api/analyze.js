// Vercel Serverless Function to analyze attendance screenshots
// Node.js runtime

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { image } = request.body; // base64 image data

  if (!image) {
    return response.status(400).json({ error: 'Image data is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: 'Gemini API Key is not configured on the server.' });
  }

  const prompt = `You are a strict data extraction bot. Analyze this timetable or attendance screenshot.
Extract the student's subjects, attended classes, total classes, and any schedule days.
Also try to identify if a subject is a theory, lab, or workshop and assign a batch if visible (A or B).
If attended/total numbers are not visible, assume 0.

Return ONLY a valid JSON array of objects with these exact keys:
- "name": string (subject name, clean and concise)
- "attended": number
- "total": number
- "batch": "A" | "B" | null
- "days": array of strings (choose from: "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"). If unknown, empty array.

Example:
[
  { "name": "Data Structures", "attended": 12, "total": 15, "batch": null, "days": ["Mon", "Wed"] },
  { "name": "DBMS (L)", "attended": 3, "total": 4, "batch": "A", "days": ["Tue"] }
]

Do not include markdown tags (\`\`\`json) or any other text. Just the raw JSON array.`;

  try {
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: 'image/png', data: image } }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          response_mime_type: 'application/json'
        }
      })
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error('Gemini API Error:', errorData);
      return response.status(502).json({ error: 'External AI service failed.' });
    }

    const result = await geminiResponse.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return response.status(500).json({ error: 'AI returned empty results.' });
    }

    const extractedData = JSON.parse(text);
    return response.status(200).json(extractedData);

  } catch (error) {
    console.error('Serverless Function Error:', error);
    return response.status(500).json({ error: 'Failed to process image.' });
  }
}
