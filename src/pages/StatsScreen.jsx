import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { useAttendance } from '../hooks/useAttendance'

export default function StatsScreen() {
  const navigate = useNavigate()
  const { data, loading } = useAttendance()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e13] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!data) {
    navigate('/setup', { replace: true })
    return null
  }

  const totalClasses = data.subjects.reduce((s, sub) => s + sub.total, 0)
  const totalAttended = data.subjects.reduce((s, sub) => s + sub.attended, 0)

  const subjectsWithPercent = data.subjects
    .filter((s) => s.total > 0)
    .map((s) => ({ ...s, percent: (s.attended / s.total) * 100 }))

  const best = subjectsWithPercent.length > 0
    ? subjectsWithPercent.reduce((a, b) => (a.percent >= b.percent ? a : b))
    : null

  const worst = subjectsWithPercent.length > 0
    ? subjectsWithPercent.reduce((a, b) => (a.percent <= b.percent ? a : b))
    : null

  const setupDate = data.createdAt || null
  const daysTracked = setupDate
    ? Math.max(1, Math.floor((Date.now() - new Date(setupDate).getTime()) / 86400000))
    : '--'

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
        <h2 className="font-headline font-bold text-2xl text-on-surface tracking-tight">Quick Stats</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card rounded-lg p-5 flex flex-col items-center text-center">
            <span className="font-headline font-bold text-3xl text-primary">{totalClasses}</span>
            <span className="font-body text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mt-2">Total Classes</span>
          </div>
          <div className="glass-card rounded-lg p-5 flex flex-col items-center text-center">
            <span className="font-headline font-bold text-3xl text-secondary">{totalAttended}</span>
            <span className="font-body text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mt-2">Classes Attended</span>
          </div>
        </div>

        <div className="glass-card rounded-lg p-5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-body text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">Best Subject</span>
            <span className="font-headline font-semibold text-lg text-on-surface mt-1">{best ? best.name : '--'}</span>
          </div>
          <span className="font-headline font-bold text-xl text-secondary">{best ? `${Math.round(best.percent)}%` : '--'}</span>
        </div>

        <div className="glass-card rounded-lg p-5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-body text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">Worst Subject</span>
            <span className="font-headline font-semibold text-lg text-on-surface mt-1">{worst ? worst.name : '--'}</span>
          </div>
          <span className="font-headline font-bold text-xl text-error">{worst ? `${Math.round(worst.percent)}%` : '--'}</span>
        </div>

        <div className="glass-card rounded-lg p-5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-body text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">Days Tracked</span>
            <span className="font-headline font-semibold text-lg text-on-surface mt-1">{daysTracked} {typeof daysTracked === 'number' ? (daysTracked === 1 ? 'day' : 'days') : ''}</span>
          </div>
          <span className="material-symbols-outlined text-primary text-3xl">calendar_month</span>
        </div>
      </main>
      <BottomNav active="stats" />
    </div>
  )
}
