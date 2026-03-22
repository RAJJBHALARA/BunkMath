import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import SubjectCard from '../components/SubjectCard'
import UpdateModal from '../components/UpdateModal'
import { useAttendance } from '../hooks/useAttendance'

const STORAGE_KEY = 'iqSetup'
const getStatus = (percent, minPercent) => {
  if (percent >= minPercent) return 'safe'
  if (percent >= minPercent - 5) return 'warning'
  return 'danger'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: setupData, updateData, loading: dataLoading } = useAttendance()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [streak, setStreak] = useState({ count: 0, lastMarked: null })

  useEffect(() => {
    if (!dataLoading && !setupData) {
      navigate('/setup', { replace: true })
    }
  }, [setupData, dataLoading, navigate])

  const metrics = useMemo(() => {
    if (!setupData) return null

    const totalAttended = setupData.subjects.reduce((sum, subject) => sum + subject.attended, 0)
    const totalClasses = setupData.subjects.reduce((sum, subject) => sum + subject.total, 0)

    let overallPercent = 0
    if (setupData.countMode === 'overall') {
      overallPercent = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0
    } else {
      const validSubjects = setupData.subjects.filter((s) => s.total > 0)
      if (validSubjects.length > 0) {
        const sumPercents = validSubjects.reduce((sum, subject) => sum + (subject.attended / subject.total) * 100, 0)
        overallPercent = sumPercents / validSubjects.length
      }
    }

    const roundedOverallPercent = setupData.subjects.some(s => s.total > 0) ? Math.round(overallPercent) : null
    const overallStatus = roundedOverallPercent !== null ? getStatus(overallPercent, setupData.minPercent) : null

    // Feature 4: Bunk Budget
    const minRatio = setupData.minPercent / 100
    let totalSafeSkips = 0
    let totalRecovery = 0
    let hasAnySafe = false
    let hasAnyDanger = false
    const dangerSubjectNames = []

    setupData.subjects.forEach((subject) => {
      if (subject.total === 0) return
      const pct = (subject.attended / subject.total) * 100
      const status = getStatus(pct, setupData.minPercent)
      if (status === 'safe') {
        hasAnySafe = true
        totalSafeSkips += Math.max(0, Math.floor((subject.attended - minRatio * subject.total) / (1 - minRatio)))
      }
      if (status === 'danger') {
        hasAnyDanger = true
        dangerSubjectNames.push(subject.name)
        totalRecovery += Math.max(0, Math.ceil((minRatio * subject.total - subject.attended) / (1 - minRatio)))
      }
    })

    return {
      totalAttended,
      totalClasses,
      overallPercent,
      roundedOverallPercent,
      overallStatus,
      totalSafeSkips,
      totalRecovery,
      hasAnySafe,
      hasAnyDanger,
      dangerSubjectNames,
    }
  }, [setupData])

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-[#0e0e13] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!setupData || !metrics) return null

  const hasClasses = metrics.totalClasses > 0

  const overallClass = !hasClasses
    ? 'text-on-surface-variant'
    : metrics.overallStatus === 'safe'
    ? 'text-secondary'
    : metrics.overallStatus === 'warning'
    ? 'text-tertiary'
    : 'text-error'

  const overallStatusText = !hasClasses
    ? 'Not Started'
    : metrics.overallStatus === 'safe'
    ? 'Safe'
    : metrics.overallStatus === 'warning'
    ? 'Warning'
    : 'Danger'

  const saveAttendance = async (updatedSubjects) => {
    const updatedData = {
      ...setupData,
      subjects: updatedSubjects,
    }

    try {
      await updateData(updatedData)
      setIsModalOpen(false)
    } catch (err) {
      console.error(err)
      alert('Failed to sync with cloud. Please try again.')
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
          <div className="flex items-center gap-3">
            {/* Feature 2: Streak counter */}
            {streak.count > 0 && (
              <span className="text-[12px] font-bold text-on-surface bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                🔥 {streak.count} day{streak.count !== 1 ? 's' : ''}
              </span>
            )}
            <button
              className="hover:opacity-80 transition-opacity scale-95 active:scale-90"
              onClick={() => {
                if (window.confirm('Reset all data and go back to setup?')) {
                  localStorage.removeItem(STORAGE_KEY)
                  localStorage.removeItem(STREAK_KEY)
                  navigate('/setup', { replace: true })
                }
              }}
              title="Reset & Reconfigure"
              type="button"
            >
              <span className="material-symbols-outlined text-[#acaab1]">settings</span>
            </button>
          </div>
        </div>
      </header>
      <main className="pt-24 px-5 space-y-8 max-w-[390px] mx-auto">
        <section className="glass-card rounded-lg p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-[60px] rounded-full"></div>
          <div className="flex flex-col items-center text-center">
            <h2 className="font-body text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-2">Overall Attendance</h2>
            <div className={`font-headline font-bold text-6xl tracking-tighter ${overallClass}`}>
              {hasClasses ? metrics.roundedOverallPercent : '--'}
              {hasClasses && <span className="text-3xl opacity-60">%</span>}
            </div>
            <div
              className={`mt-4 px-3 py-1 rounded-full text-[10px] font-medium tracking-wide uppercase ${
                !hasClasses
                  ? 'bg-surface-container-high/40 text-on-surface-variant'
                  : metrics.overallStatus === 'safe'
                  ? 'bg-secondary-container/20 text-secondary'
                  : metrics.overallStatus === 'warning'
                  ? 'bg-tertiary-container/20 text-tertiary'
                  : 'bg-error-container/20 text-error'
              }`}
            >
              Status: {overallStatusText}
            </div>
          </div>
        </section>

        {/* Feature 4: Bunk Budget */}
        {hasClasses && metrics.hasAnySafe && (
          <div className="flex items-center justify-center gap-2 px-4 py-2">
            <span className="material-symbols-outlined text-[16px] text-secondary">event_available</span>
            <span className="text-[12px] font-medium text-on-surface-variant">You can bunk <strong className="text-secondary">{metrics.totalSafeSkips}</strong> more classes overall</span>
          </div>
        )}
        {hasClasses && metrics.hasAnyDanger && !metrics.hasAnySafe && (
          <div className="flex items-center justify-center gap-2 px-4 py-2">
            <span className="material-symbols-outlined text-[16px] text-error">warning</span>
            <span className="text-[12px] font-medium text-on-surface-variant">You need to attend <strong className="text-error">{metrics.totalRecovery}</strong> classes to get back on track</span>
          </div>
        )}

        {/* Exam eligibility warning */}
        {hasClasses && metrics.hasAnyDanger && (
          <div className="glass-card rounded-lg p-4 flex items-start gap-3 border border-error/30 bg-error-container/10">
            <span className="material-symbols-outlined text-error text-[20px] mt-0.5">gavel</span>
            <div className="flex flex-col gap-1">
              <span className="font-headline font-bold text-[13px] text-error">⚠️ Exam Eligibility at Risk</span>
              <span className="text-[11px] text-on-surface-variant leading-relaxed">
                Your attendance in <strong className="text-error">{metrics.dangerSubjectNames.join(', ')}</strong> is below {setupData.minPercent}%. You may be barred from exams.
              </span>
            </div>
          </div>
        )}

        {/* Feature 6: Empty state message */}
        {!hasClasses && (
          <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
            <span className="text-3xl">📚</span>
            <p className="text-on-surface-variant text-sm font-medium">No classes marked yet.</p>
            <p className="text-on-surface-variant/60 text-xs">Tap <strong>Update Today</strong> to get started!</p>
          </div>
        )}

        <section className="space-y-4">
          <h3 className="font-body text-[10px] uppercase tracking-[0.15em] text-on-surface-variant px-1">Your Subjects</h3>
          <div className="space-y-4">
            {setupData.subjects.map((subject) => (
              <SubjectCard key={subject.id} minPercent={setupData.minPercent} subject={subject} />
            ))}
          </div>
        </section>
      </main>
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60]">
        <button className="flex items-center gap-2 px-6 py-4 bg-[#0e0e13]/40 backdrop-blur-xl border border-[#7C3AED]/30 rounded-full shadow-[0_10px_30px_rgba(124,58,237,0.2)] scale-95 active:scale-90 transition-all duration-200" onClick={() => setIsModalOpen(true)} type="button">
          <span className="material-symbols-outlined text-white font-bold">add</span>
          <span className="text-white font-bold text-sm tracking-tight">Update Today</span>
        </button>
      </div>
      <BottomNav active="dash" />
      {isModalOpen && (
        <UpdateModal
          onClose={() => setIsModalOpen(false)}
          onSave={saveAttendance}
          subjects={setupData.subjects}
        />
      )}
    </div>
  )
}
