import { useState } from 'react'
import { auth, googleProvider } from '../firebase'
import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

export default function LoginScreen() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      await signInWithPopup(auth, googleProvider)
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Failed to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0e13] flex flex-col items-center justify-center p-6 text-on-surface">
      <div className="w-full max-w-[390px] space-y-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_40px_rgba(189,157,255,0.2)]">
            <span className="material-symbols-outlined text-5xl font-bold">bolt</span>
          </div>
          <div className="space-y-2">
            <h1 className="font-headline font-bold text-4xl tracking-tight text-white italic">BunkMath</h1>
            <p className="font-body text-on-surface-variant text-sm px-8 leading-relaxed">
              Smart attendance calculator for the modern bunk expert.
            </p>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-8 space-y-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
          
          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <h2 className="font-headline font-bold text-xl text-white">Welcome back</h2>
              <p className="text-[12px] text-on-surface-variant uppercase tracking-widest font-semibold">Sign in to sync your attendance</p>
            </div>

            {error && (
              <div className="bg-error-container/20 border border-error/30 text-error text-[11px] p-3 rounded-xl font-medium flex items-start gap-2">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-14 bg-white text-black rounded-2xl font-headline font-bold text-sm flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-white/5"
            >
              {!loading ? (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              ) : (
                <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              )}
            </button>
          </div>
        </div>

        <p className="text-center font-body text-[10px] text-on-surface-variant/40 px-12 leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
