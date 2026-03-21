import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

const STORAGE_KEY = 'iqSetup'
const STREAK_KEY = 'iqStreak'

export default function ProfileScreen() {
  const navigate = useNavigate()

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
    if (window.confirm('This will erase ALL your attendance data. Are you sure?')) {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(STREAK_KEY)
      navigate('/setup', { replace: true })
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

        <div className="glass-card rounded-lg p-6 flex flex-col items-center text-center gap-2">
          <span className="material-symbols-outlined text-primary text-5xl">school</span>
          <span className="font-headline font-bold text-xl text-on-surface mt-2">BunkMath</span>
          <span className="font-body text-[11px] text-on-surface-variant uppercase tracking-widest">v1.0.0</span>
          <p className="text-on-surface-variant/60 text-xs mt-1">Smart attendance calculator for Indian college students</p>
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

        <button
          className="w-full py-4 rounded-lg bg-error-container/20 border border-error/30 text-error font-headline font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          onClick={handleReset}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">delete_forever</span>
          Reset Everything
        </button>
        <p className="text-center text-on-surface-variant/40 text-[10px] tracking-widest uppercase font-label">This will erase all your data</p>
      </main>
      <BottomNav active="profile" />
    </div>
  )
}
