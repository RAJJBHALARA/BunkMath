import { useState, useRef } from 'react'

export default function AISetupModal({ onClose, onDataExtracted }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('geminiApiKey') || import.meta.env.VITE_GEMINI_API_KEY || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!apiKey) {
      setError('Please provide a Gemini API Key first.')
      return
    }

    localStorage.setItem('geminiApiKey', apiKey)

    try {
      setLoading(true)
      setError(null)

      // Convert image to base64
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        const base64Data = reader.result.split(',')[1]

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

Do not include markdown tags (\`\`\`json) or any other text. Just the raw JSON array.`

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                { inline_data: { mime_type: file.type, data: base64Data } }
              ]
            }],
            generationConfig: {
              temperature: 0.1,
              response_mime_type: 'application/json'
            }
          })
        })

        if (!response.ok) {
          throw new Error('Failed to analyze image. Please verify your API Key and internet connection.')
        }

        const result = await response.json()
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text
        
        if (!text) throw new Error('No data returned from AI.')

        let extractedData
        try {
          extractedData = JSON.parse(text)
          if (!Array.isArray(extractedData)) throw new Error('Data is not an array')
        } catch (err) {
          console.error('API returned non-JSON:', text)
          throw new Error('AI returned an invalid format. Please try again with a clearer screenshot.')
        }

        onDataExtracted(extractedData)
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.')
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex flex-col items-center justify-center p-6">
        <div className="glass-card w-full max-w-[390px] rounded-3xl p-6 relative shadow-2xl overflow-hidden border border-white/10">
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-primary font-headline font-bold text-xl">
              <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
              AI Import
            </div>
            <button onClick={onClose} disabled={loading} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-headline">Gemini API Key</label>
              <input 
                type="password"
                placeholder="AIzaSy..." 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={loading}
                className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-mono"
              />
              <p className="text-[10px] text-on-surface-variant/60 leading-tight">Key is stored locally on your device. Get a free key from Google AI Studio.</p>
            </div>

            {error && (
              <div className="bg-error-container/20 border border-error/30 text-error text-[11px] p-3 rounded-lg font-medium flex items-start gap-2">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {error}
              </div>
            )}

            {!loading ? (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-dim to-primary rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
                <div className="bg-surface-container border border-dashed border-primary/30 rounded-2xl p-8 flex flex-col items-center gap-3 relative z-10 group-hover:border-primary/60 transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                  </div>
                  <div className="text-center">
                    <p className="font-headline font-bold text-sm text-on-surface">Upload Screenshot</p>
                    <p className="text-[11px] text-on-surface-variant mt-1">Timetable or attendance portal</p>
                  </div>
                </div>
              </button>
            ) : (
              <div className="bg-surface-container border border-primary/20 rounded-2xl p-8 flex flex-col items-center gap-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
                
                {/* Scanning Animation Header */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: '2s' }}></div>
                  <div className="absolute inset-2 rounded-full border-2 border-primary/40 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
                  <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary relative z-10 shadow-[0_0_15px_rgba(189,157,255,0.4)]">
                    <span className="material-symbols-outlined text-3xl animate-pulse">memory</span>
                  </div>
                </div>
                
                <div className="text-center w-full z-10">
                  <p className="font-headline font-bold text-sm text-primary mb-1 animate-pulse tracking-wide">AI IS ANALYZING TEXT...</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold opacity-70">Extracting Subjects & Attendance</p>
                </div>

                {/* Scanning Line effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_10px_rgba(189,157,255,0.8)] ai-scan-line"></div>
              </div>
            )}

            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />

          </div>
        </div>
      </div>
    </>
  )
}
