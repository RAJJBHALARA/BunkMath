import { useMemo, useState } from 'react'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function UpdateModal({ subjects, onClose, onSave }) {
  // Filter to only subjects that have class today
  const todayName = useMemo(() => {
    // Use a fixed reference date for display; actual day is derived from real Date
    const now = new Date()
    return DAY_NAMES[now.getDay()]
  }, [])

  const todaySubjects = useMemo(() => {
    return subjects.filter((subject) => {
      // If a subject has no days set (legacy data), show it always
      if (!subject.days || subject.days.length === 0) return true
      return subject.days.includes(todayName)
    })
  }, [subjects, todayName])

  const [selections, setSelections] = useState(() => {
    const initial = {}
    todaySubjects.forEach((subject) => {
      initial[subject.id] = null
    })
    return initial
  })

  const dateLabel = useMemo(() => {
    const now = new Date()
    return now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }, [])

  const setSubjectSelection = (subjectId, value) => {
    setSelections((prev) => ({ ...prev, [subjectId]: value }))
  }

  const handleSave = () => {
    const updatedSubjects = subjects.map((subject) => {
      const selection = selections[subject.id]

      if (selection === 'present') {
        return {
          ...subject,
          attended: subject.attended + 1,
          total: subject.total + 1,
        }
      }

      if (selection === 'absent') {
        return {
          ...subject,
          total: subject.total + 1,
        }
      }

      return subject
    })

    onSave(updatedSubjects)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"></div>
      <div className="fixed bottom-0 left-0 right-0 z-[70] max-w-[390px] mx-auto">
        <div className="frosted-glass rounded-t-[2.5rem] p-8 pb-10 shadow-[0_-20px_50px_rgba(0,0,0,0.6)] border-t border-white/10">
          <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-8"></div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline font-bold text-2xl text-on-surface tracking-tight">Mark Today's Classes</h2>
            <span className="text-on-surface-variant text-[10px] font-bold bg-white/5 px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/5">{dateLabel}</span>
          </div>

          {todaySubjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <span className="text-4xl">🎉</span>
              <p className="text-on-surface font-headline font-semibold text-lg text-center">No classes today!</p>
              <p className="text-on-surface-variant text-sm text-center">Enjoy your free day 🎉</p>
            </div>
          ) : (
            <div className="space-y-4 mb-10">
              {todaySubjects.map((subject, index) => {
                const selected = selections[subject.id]
                const showTime = index === 0 ? '09:00 AM - 10:00 AM' : index === 1 ? '10:15 AM - 11:15 AM' : '11:30 AM - 12:30 PM'

                return (
                  <div className="flex items-center justify-between bg-white/[0.03] p-5 rounded-3xl border border-white/5" key={subject.id}>
                    <div className="flex flex-col">
                      <span className="font-headline font-semibold text-on-surface text-[15px]">{subject.name}</span>
                      <span className="font-body text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">{showTime}</span>
                    </div>
                    <div className="flex gap-2.5">
                      <button
                        className={
                          selected === 'present'
                            ? 'px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary-container text-secondary-fixed transition-all active:scale-95'
                            : 'px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider border border-secondary/40 text-secondary hover:bg-secondary/10 transition-all active:scale-95'
                        }
                        onClick={() => setSubjectSelection(subject.id, 'present')}
                        type="button"
                      >
                        Present
                      </button>
                      <button
                        className={
                          selected === 'absent'
                            ? 'px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider bg-error-container text-on-error transition-all active:scale-95'
                            : 'px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider border border-error/40 text-error hover:bg-error/10 transition-all active:scale-95'
                        }
                        onClick={() => setSubjectSelection(subject.id, 'absent')}
                        type="button"
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex flex-col items-center gap-6">
            <button className="text-on-surface-variant text-sm font-medium hover:text-on-surface transition-colors" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="w-full py-5 rounded-full bg-white/5 neon-border-glow text-on-surface font-headline font-bold text-lg relative group overflow-hidden transition-all active:scale-[0.98]" onClick={handleSave} type="button">
              <span className="relative z-10">Save Attendance</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/20 blur-2xl rounded-full"></div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
