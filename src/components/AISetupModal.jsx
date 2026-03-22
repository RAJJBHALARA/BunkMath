import { useState, useRef } from 'react'

export default function AISetupModal({ onClose, onDataExtracted }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)
  const [base64Image, setBase64Image] = useState(null)
  const fileInputRef = useRef(null)
  
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setError(null)

    // Convert image to base64 for preview and sending to backend
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setPreview(reader.result)
      setBase64Image(reader.result.split(',')[1])
    }
  }

  const handleAnalyze = async () => {
    if (!base64Image) {
      setError('Please select an image first.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Failed to analyze image. Please ensure your Vercel deployment is configured with a GEMINI_API_KEY.')
      }

      const extractedData = await response.json()
      
      if (!extractedData || !Array.isArray(extractedData)) {
        throw new Error('AI returned an invalid format. Please try again with a clearer screenshot.')
      }

      onDataExtracted(extractedData)
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.')
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex flex-col items-center justify-center p-6 text-on-surface">
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
            {error && (
              <div className="bg-error-container/20 border border-error/30 text-error text-[11px] p-3 rounded-lg font-medium flex items-start gap-2">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {error}
              </div>
            )}

            {!loading ? (
              <div className="space-y-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-surface-container border border-dashed border-primary/30 rounded-2xl p-6 flex flex-col items-center gap-3 relative group hover:border-primary/60 transition-colors cursor-pointer"
                >
                  {preview ? (
                    <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10 relative">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">Change Photo</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                      </div>
                      <div className="text-center">
                        <p className="font-headline font-bold text-sm">Upload Screenshot</p>
                        <p className="text-[11px] text-on-surface-variant mt-1">Timetable or attendance portal</p>
                      </div>
                    </>
                  )}
                </div>

                {preview && (
                  <button 
                    onClick={handleAnalyze}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-dim to-primary text-on-primary-fixed font-headline font-bold text-sm shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>Analyze Timetable</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">auto_awesome</span>
                  </button>
                )}
              </div>
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

