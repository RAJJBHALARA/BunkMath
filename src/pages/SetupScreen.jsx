import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STORAGE_KEY = 'iqSetup'
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const TEMPLATES = [
  { label: 'Engineering', icon: 'engineering', subjects: ['DBMS (T)', 'DBMS (L)', 'OS (T)', 'OS (L)', 'CN (T)', 'Maths', 'DSA (T)', 'DSA (L)'] },
  { label: 'Diploma CS', icon: 'computer', subjects: ['C++ (T)', 'C++ (L)', 'Web Dev (T)', 'Web Dev (L)', 'DBMS (T)', 'DBMS (L)', 'Networking', 'Maths'] },
  { label: 'BCA/BSc', icon: 'science', subjects: ['Python (T)', 'Python (L)', 'Java (T)', 'Java (L)', 'SQL', 'Statistics', 'English'] },
  { label: 'Custom', icon: 'edit', subjects: [] },
]

export default function SetupScreen() {
  const navigate = useNavigate()
  const [minPercent, setMinPercent] = useState(80)
  const [countMode, setCountMode] = useState('perSubject')
  const [subjectCount, setSubjectCount] = useState(4)
  const [subjectNames, setSubjectNames] = useState(['', '', '', ''])
  const [subjectDays, setSubjectDays] = useState([[], [], [], []])
  const [subjectBatches, setSubjectBatches] = useState([null, null, null, null])
  const [error, setError] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  // Mid-semester entry
  const [midSemester, setMidSemester] = useState(false)
  const [existingAttended, setExistingAttended] = useState([0, 0, 0, 0])
  const [existingTotal, setExistingTotal] = useState([0, 0, 0, 0])

  useEffect(() => {
    setSubjectNames((prev) => {
      if (prev.length === subjectCount) return prev
      if (prev.length < subjectCount)
        return [...prev, ...Array(subjectCount - prev.length).fill('')]
      return prev.slice(0, subjectCount)
    })
    setSubjectDays((prev) => {
      if (prev.length === subjectCount) return prev
      if (prev.length < subjectCount)
        return [...prev, ...Array(subjectCount - prev.length).fill([])]
      return prev.slice(0, subjectCount)
    })
    setExistingAttended((prev) => {
      if (prev.length === subjectCount) return prev
      if (prev.length < subjectCount)
        return [...prev, ...Array(subjectCount - prev.length).fill(0)]
      return prev.slice(0, subjectCount)
    })
    setExistingTotal((prev) => {
      if (prev.length === subjectCount) return prev
      if (prev.length < subjectCount)
        return [...prev, ...Array(subjectCount - prev.length).fill(0)]
      return prev.slice(0, subjectCount)
    })
    setSubjectBatches((prev) => {
      if (prev.length === subjectCount) return prev
      if (prev.length < subjectCount)
        return [...prev, ...Array(subjectCount - prev.length).fill(null)]
      return prev.slice(0, subjectCount)
    })
  }, [subjectCount])

  const applyTemplate = (template, index) => {
    setSelectedTemplate(index)
    if (template.subjects.length > 0) {
      const count = template.subjects.length
      setSubjectCount(count)
      setSubjectNames([...template.subjects])
      setSubjectDays(Array(count).fill([]))
      setSubjectBatches(Array(count).fill(null))
      setExistingAttended(Array(count).fill(0))
      setExistingTotal(Array(count).fill(0))
    }
  }

  const updateSubjectName = (index, value) => {
    setSubjectNames((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const toggleBatch = (index, batch) => {
    setSubjectBatches((prev) => {
      const next = [...prev]
      next[index] = prev[index] === batch ? null : batch
      return next
    })
  }

  const updateExistingAttended = (index, value) => {
    const num = Math.max(0, parseInt(value) || 0)
    setExistingAttended((prev) => {
      const next = [...prev]
      next[index] = num
      return next
    })
  }

  const updateExistingTotal = (index, value) => {
    const num = Math.max(0, parseInt(value) || 0)
    setExistingTotal((prev) => {
      const next = [...prev]
      next[index] = num
      return next
    })
  }

  const toggleDay = (subjectIndex, day) => {
    setSubjectDays((prev) => {
      const next = prev.map((d) => [...d])
      if (next[subjectIndex].includes(day)) {
        next[subjectIndex] = next[subjectIndex].filter((d) => d !== day)
      } else {
        next[subjectIndex] = [...next[subjectIndex], day]
      }
      return next
    })
  }

  const addSplit = (index, suffix) => {
    if (subjectCount >= 20) return

    const currentName = subjectNames[index] ? subjectNames[index].replace(/\s*\([TLW]\)$/, '').trim() : ''
    const baseName = currentName || `Subject ${index + 1}`
    const newName = `${baseName} (${suffix})`

    setSubjectCount(c => c + 1)

    setSubjectNames((prev) => {
      const next = [...prev]
      next.splice(index + 1, 0, newName)
      return next
    })
    setSubjectDays((prev) => {
      const next = [...prev]
      next.splice(index + 1, 0, [])
      return next
    })
    setSubjectBatches((prev) => {
      const next = [...prev]
      next.splice(index + 1, 0, null)
      return next
    })
    setExistingAttended((prev) => {
      const next = [...prev]
      next.splice(index + 1, 0, 0)
      return next
    })
    setExistingTotal((prev) => {
      const next = [...prev]
      next.splice(index + 1, 0, 0)
      return next
    })
  }

  const removeSubject = (indexToRemove) => {
    if (subjectCount <= 1) return // Keep at least 1

    setSubjectCount(c => c - 1)
    
    setSubjectNames(prev => prev.filter((_, i) => i !== indexToRemove))
    setSubjectDays(prev => prev.filter((_, i) => i !== indexToRemove))
    setSubjectBatches(prev => prev.filter((_, i) => i !== indexToRemove))
    setExistingAttended(prev => prev.filter((_, i) => i !== indexToRemove))
    setExistingTotal(prev => prev.filter((_, i) => i !== indexToRemove))
  }

  const handleSubmit = () => {
    const trimmedNames = subjectNames.map((name) => name.trim())

    if (trimmedNames.some((name) => !name)) {
      setError('Please enter all subject names')
      return
    }

    if (midSemester) {
      for (let i = 0; i < subjectCount; i++) {
        if (existingAttended[i] > existingTotal[i]) {
          setError(`Attended can't be more than total for ${trimmedNames[i]}`)
          return
        }
      }
    }

    const setupData = {
      minPercent,
      countMode,
      createdAt: new Date().toISOString(),
      subjects: trimmedNames.map((name, index) => ({
        id: index + 1,
        name,
        attended: midSemester ? existingAttended[index] : 0,
        total: midSemester ? existingTotal[index] : 0,
        days: subjectDays[index] ?? [],
        batch: subjectBatches[index] ?? null,
      })),
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(setupData))
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col items-center justify-start overflow-x-hidden antialiased">
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-8 bg-gradient-to-b from-[#131319] to-transparent">
        <div className="flex flex-col">
          <div className="text-[#bd9dff] font-headline font-bold italic flex items-center gap-1 text-xl tracking-tight">
            <span className="material-symbols-outlined" data-icon="bolt">bolt</span>
            BunkMath
          </div>
          <p className="text-primary italic font-headline text-sm mt-1 opacity-90">Know exactly when to bunk.</p>
        </div>
      </header>
      <main className="w-full max-w-[390px] px-6 pt-32 pb-12 flex flex-col gap-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary-dim/10 blur-[100px] -z-10"></div>

        {/* Feature 1: Template cards */}
        <section className="flex flex-col gap-3">
          <label className="font-headline font-semibold text-on-surface-variant text-sm tracking-wide uppercase">Quick Setup</label>
          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map((template, index) => (
              <button
                key={template.label}
                type="button"
                onClick={() => applyTemplate(template, index)}
                className={
                  selectedTemplate === index
                    ? 'glass-card rounded-lg p-4 flex flex-col items-center gap-2 text-center ring-1 ring-primary/40 bg-primary/10 transition-all active:scale-95'
                    : 'glass-card rounded-lg p-4 flex flex-col items-center gap-2 text-center hover:bg-white/[0.04] transition-all active:scale-95'
                }
              >
                <span className="material-symbols-outlined text-primary text-2xl">{template.icon}</span>
                <span className="font-headline font-semibold text-sm text-on-surface">{template.label}</span>
                <span className="font-body text-[10px] text-on-surface-variant">
                  {template.subjects.length > 0 ? `${template.subjects.length} subjects` : 'Build your own'}
                </span>
              </button>
            ))}
          </div>
        </section>

        <div className="glass-card rounded-lg p-6 flex flex-col gap-8 shadow-2xl">
          <section className="flex flex-col gap-4">
            <label className="font-headline font-semibold text-on-surface-variant text-sm tracking-wide uppercase">What's your minimum attendance?</label>
            <div className="flex gap-3">
              {[75, 80, 85].map((value) => (
                <button
                  className={
                    minPercent === value
                      ? 'flex-1 py-3 rounded-full bg-gradient-to-br from-primary-dim to-primary text-on-primary-fixed font-bold text-sm shadow-lg shadow-primary/20 ring-1 ring-primary-fixed/30'
                      : 'flex-1 py-3 rounded-full border border-outline-variant/20 font-medium text-sm transition-all bg-surface-container-high/40 hover:bg-surface-container-high'
                  }
                  key={value}
                  onClick={() => setMinPercent(value)}
                  type="button"
                >
                  {value}%
                </button>
              ))}
            </div>
          </section>
          <section className="flex flex-col gap-4">
            <label className="font-headline font-semibold text-on-surface-variant text-sm tracking-wide uppercase">How does your college count?</label>
            <div className="flex p-1 bg-surface-container-lowest/50 rounded-full border border-outline-variant/10">
              <button
                className={
                  countMode === 'perSubject'
                    ? 'flex-1 py-2 rounded-full bg-surface-container-highest text-on-surface font-medium text-sm'
                    : 'flex-1 py-2 rounded-full text-on-surface-variant font-medium text-sm'
                }
                onClick={() => setCountMode('perSubject')}
                type="button"
              >
                Per Subject
              </button>
              <button
                className={
                  countMode === 'overall'
                    ? 'flex-1 py-2 rounded-full bg-surface-container-highest text-on-surface font-medium text-sm'
                    : 'flex-1 py-2 rounded-full text-on-surface-variant font-medium text-sm'
                }
                onClick={() => setCountMode('overall')}
                type="button"
              >
                Overall
              </button>
            </div>
          </section>
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="font-headline font-semibold text-on-surface-variant text-sm tracking-wide uppercase">How many subjects?</label>
              <div className="flex items-center bg-surface-container rounded-full p-1 gap-4">
                <button className="w-8 h-8 flex items-center justify-center bg-surface-container-high rounded-full text-primary hover:bg-surface-bright active:scale-90 transition-all" onClick={() => setSubjectCount((prev) => Math.max(1, prev - 1))} type="button">
                  <span className="material-symbols-outlined text-lg" data-icon="remove">remove</span>
                </button>
                <span className="font-headline font-bold text-lg w-4 text-center">{subjectCount}</span>
                <button className="w-8 h-8 flex items-center justify-center bg-surface-container-high rounded-full text-primary hover:bg-surface-bright active:scale-90 transition-all" onClick={() => setSubjectCount((prev) => Math.min(20, prev + 1))} type="button">
                  <span className="material-symbols-outlined text-lg" data-icon="add">add</span>
                </button>
              </div>
            </div>
          </section>

          {/* Mid-semester toggle */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="font-headline font-semibold text-on-surface-variant text-sm tracking-wide uppercase">Starting mid-semester?</label>
              <button
                type="button"
                onClick={() => setMidSemester((prev) => !prev)}
                className={
                  midSemester
                    ? 'w-12 h-7 rounded-full bg-gradient-to-r from-primary-dim to-primary relative transition-all active:scale-95'
                    : 'w-12 h-7 rounded-full bg-surface-container-high border border-outline-variant/20 relative transition-all active:scale-95'
                }
              >
                <div
                  className={
                    midSemester
                      ? 'w-5 h-5 rounded-full bg-white absolute top-1 right-1 transition-all shadow-sm'
                      : 'w-5 h-5 rounded-full bg-on-surface-variant absolute top-1 left-1 transition-all shadow-sm'
                  }
                />
              </button>
            </div>
            {midSemester && (
              <p className="text-on-surface-variant/60 text-[11px] tracking-wide">Enter your current attended & total classes for each subject below</p>
            )}
          </section>

          <section className="flex flex-col gap-3">
            <label className="font-headline font-semibold text-on-surface-variant text-sm tracking-wide uppercase">Enter Subject Names</label>
            <div className="flex flex-col gap-4">
              {Array.from({ length: subjectCount }).map((_, index) => (
                <div className="flex flex-col gap-2" key={index + 1}>
                  <div className="relative flex gap-2">
                    <input
                      className="flex-1 bg-surface-container-low/50 border border-outline-variant/20 rounded-md py-3 px-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/40"
                      onChange={(event) => updateSubjectName(index, event.target.value)}
                      placeholder={`Subject ${index + 1}${index === 0 ? ' (e.g. Data Structures)' : index === 1 ? ' (e.g. OS)' : ''}`}
                      type="text"
                      value={subjectNames[index] ?? ''}
                    />
                    {subjectCount > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeSubject(index)}
                        className="w-[46px] flex items-center justify-center bg-error-container/20 text-error rounded-md border border-error/20 hover:bg-error-container active:scale-95 transition-all"
                        title="Remove Subject"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </div>

                  {/* Mid-semester: existing attendance inputs */}
                  {midSemester && (
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <input
                          className="w-full bg-surface-container-low/50 border border-outline-variant/20 rounded-md py-2.5 px-3 text-sm focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition-all placeholder:text-on-surface-variant/40"
                          onChange={(e) => updateExistingAttended(index, e.target.value)}
                          placeholder="Attended"
                          type="number"
                          min="0"
                          value={existingAttended[index] || ''}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-on-surface-variant/50 uppercase">attended</span>
                      </div>
                      <div className="flex-1 relative">
                        <input
                          className="w-full bg-surface-container-low/50 border border-outline-variant/20 rounded-md py-2.5 px-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/40"
                          onChange={(e) => updateExistingTotal(index, e.target.value)}
                          placeholder="Total"
                          type="number"
                          min="0"
                          value={existingTotal[index] || ''}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-on-surface-variant/50 uppercase">total</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    {DAYS.map((day) => {
                      const selected = (subjectDays[index] ?? []).includes(day)
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(index, day)}
                          className={
                            selected
                              ? 'px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gradient-to-br from-primary-dim to-primary text-on-primary-fixed shadow-sm shadow-primary/20 transition-all active:scale-95'
                              : 'px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:text-primary transition-all active:scale-95'
                          }
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                  
                  {/* Batch Toggle Buttons */}
                  <div className="flex gap-2 mt-1 px-1">
                    <button
                      type="button"
                      onClick={() => toggleBatch(index, 'A')}
                      className={
                        subjectBatches[index] === 'A'
                          ? 'px-3 py-1.5 rounded-full bg-gradient-to-br from-primary-dim to-primary text-on-primary-fixed text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm shadow-primary/20 active:scale-95 transition-all w-fit'
                          : 'px-3 py-1.5 rounded-full bg-surface-container-highest border border-outline-variant/30 text-[10px] text-primary hover:bg-primary/10 font-bold uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all w-fit'
                      }
                    >
                      <span className="material-symbols-outlined text-[14px]">group</span> A Batch
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleBatch(index, 'B')}
                      className={
                        subjectBatches[index] === 'B'
                          ? 'px-3 py-1.5 rounded-full bg-gradient-to-br from-secondary to-secondary text-on-primary-fixed text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm shadow-secondary/20 active:scale-95 transition-all w-fit'
                          : 'px-3 py-1.5 rounded-full bg-surface-container-highest border border-outline-variant/30 text-[10px] text-secondary hover:bg-secondary/10 font-bold uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all w-fit'
                      }
                    >
                      <span className="material-symbols-outlined text-[14px]">group</span> B Batch
                    </button>
                  </div>

                  {/* Quick Split Buttons */}
                  <div className="flex gap-2 px-1">
                    <button type="button" onClick={() => addSplit(index, 'L')} className="px-3 py-1.5 rounded-full bg-surface-container-highest border border-outline-variant/30 text-[10px] text-primary hover:bg-primary/10 font-bold uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all w-fit"><span className="material-symbols-outlined text-[14px]">add</span> Lab</button>
                    <button type="button" onClick={() => addSplit(index, 'T')} className="px-3 py-1.5 rounded-full bg-surface-container-highest border border-outline-variant/30 text-[10px] text-secondary hover:bg-secondary/10 font-bold uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all w-fit"><span className="material-symbols-outlined text-[14px]">add</span> Theory</button>
                    <button type="button" onClick={() => addSplit(index, 'W')} className="px-3 py-1.5 rounded-full bg-surface-container-highest border border-outline-variant/30 text-[10px] text-tertiary hover:bg-tertiary/10 font-bold uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all w-fit"><span className="material-symbols-outlined text-[14px]">add</span> Workshop</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <footer className="mt-4">
          <button className="w-full py-5 rounded-lg bg-gradient-to-r from-primary-dim to-primary text-on-primary-fixed font-headline font-extrabold text-lg flex items-center justify-center gap-2 shadow-2xl shadow-primary-dim/30 active:scale-[0.98] transition-all group" onClick={handleSubmit} type="button">
            Let's Go
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
          </button>
          {error && <p className="text-center text-error text-[11px] mt-3 tracking-wide uppercase font-label">{error}</p>}
          <p className="text-center text-on-surface-variant/40 text-[10px] mt-6 tracking-widest uppercase font-label">Designed for the modern bunk expert</p>
        </footer>
      </main>
    </div>
  )
}
