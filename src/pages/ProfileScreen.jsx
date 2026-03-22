import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { useAuth } from '../context/AuthContext'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'

const STORAGE_KEY = 'iqSetup'
const STREAK_KEY = 'iqStreak'

export default function ProfileScreen() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const data = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      return JSON.parse(raw)
    } catch {
      return null
    }
  }, [])

  if (!data) {
    navigate('/setup', { replace: true })
    return null
  }

  const handleReset = () => {
    if (window.confirm('This will erase ALL your local attendance data. Are you sure?')) {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(STREAK_KEY)
      navigate('/setup', { replace: true })
    }
  }

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      try {
        await signOut(auth)
        navigate('/login')
      } catch (err) {
        console.error('Logout failed', err)
      }
    }
  }

  return (
    <div className="antialiased min-h-screen pb-32">
      <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-[#131319] to-transparent">
        <div className="flex items-center justify-between px-6 py-5 w-full">
          <div className="text-[#bd9dff] font-['Plus_Jakarta_Sans'] font-bold italic flex items-center gap-2 text-lg tracking-tight">
            <span className="material-symbols-outlined text-[#bd9dff]">bolt</span>
            <span>BunkMath</span>
          </div>
        </div>
      </header>
      <main className="pt-24 px-5 space-y-6 max-w-[390px] mx-auto">
        <h2 className="font-headline font-bold text-2xl text-on-surface tracking-tight">Profile</h2>

        <div className="glass-card rounded-lg p-6 flex flex-col items-center text-center gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full -mr-8 -mt-8"></div>
          
          {currentUser?.photoURL ? (
            <img src={currentUser.photoURL} alt="Profile" className="w-20 h-20 rounded-full border-2 border-primary/20 p-1 mb-2 relative z-10" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 relative z-10">
              <span className="material-symbols-outlined text-4xl">person</span>
            </div>
          )}
          
          <span className="font-headline font-bold text-xl text-on-surface relative z-10">
            {currentUser?.displayName || 'Student'}
          </span>
          <span className="font-body text-[10px] text-on-surface-variant uppercase tracking-widest relative z-10">
            {currentUser?.email}
          </span>
          <p className="text-on-surface-variant/60 text-[11px] mt-2 relative z-10 leading-relaxed px-4">
            Managing your academic attendance with smart AI tracking.
          </p>
        </div>

        <div className="glass-card rounded-lg p-5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-body text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">Minimum Attendance</span>
            <span className="font-headline font-semibold text-lg text-on-surface mt-1">{data.minPercent}%</span>
          </div>
          <span className="material-symbols-outlined text-primary">verified</span>
        </div>

        <div className="glass-card rounded-lg p-5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-body text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">Total Subjects</span>
            <span className="font-headline font-semibold text-lg text-on-surface mt-1">{data.subjects.length}</span>
          </div>
          <span className="material-symbols-outlined text-primary">menu_book</span>
        </div>

        <div className="glass-card rounded-lg p-5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-body text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">Counting Mode</span>
            <span className="font-headline font-semibold text-lg text-on-surface mt-1 capitalize">{data.countMode === 'perSubject' ? 'Per Subject' : 'Overall'}</span>
          </div>
          <span className="material-symbols-outlined text-primary">calculate</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            className="w-full py-4 rounded-lg bg-surface-container-high/50 border border-white/5 text-on-surface-variant font-headline font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-white/5"
            onClick={handleLogout}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
          <button
            className="w-full py-4 rounded-lg bg-error-container/10 border border-error/20 text-error font-headline font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-error-container/20"
            onClick={handleReset}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">delete_forever</span>
            Reset Data
          </button>
        </div>
        <p className="text-center text-on-surface-variant/40 text-[10px] tracking-widest uppercase font-label">BunkMath Cloud Sync Enabled</p>
      </main>
      <BottomNav active="profile" />
    </div>
  )
}
