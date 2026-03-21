const getSubjectStatus = (attended, total, minPercent) => {
  if (total === 0) return { currentPercent: null, status: 'empty' }
  const currentPercent = (attended / total) * 100
  if (currentPercent >= minPercent) return { currentPercent, status: 'safe' }
  if (currentPercent >= minPercent - 5) return { currentPercent, status: 'warning' }
  return { currentPercent, status: 'danger' }
}

export default function SubjectCard({ subject, minPercent }) {
  const { attended, total, name } = subject
  const { currentPercent, status } = getSubjectStatus(attended, total, minPercent)
  const minRatio = minPercent / 100
  const isEmpty = status === 'empty'

  const safeSkips =
    status === 'safe'
      ? Math.floor((attended - minRatio * total) / (1 - minRatio))
      : 0

  const recoveryClasses =
    status === 'danger'
      ? Math.ceil((minRatio * total - attended) / (1 - minRatio))
      : 0

  const roundedPercent = currentPercent !== null && Number.isFinite(currentPercent)
    ? Math.round(currentPercent)
    : null

  const percentTextClass = isEmpty
    ? 'text-on-surface-variant'
    : status === 'safe'
    ? 'text-secondary'
    : status === 'warning'
    ? 'text-tertiary'
    : 'text-error'

  const barClass =
    status === 'safe' ? 'bg-secondary' : status === 'warning' ? 'bg-tertiary' : status === 'danger' ? 'bg-error' : 'bg-surface-container-highest'

  return (
    <div className="glass-card rounded-lg p-5 space-y-4 shadow-sm overflow-hidden">
      <div className="flex justify-between items-start">
        <span className="font-headline font-semibold text-lg text-on-surface leading-tight">{name}</span>
        <span className={`font-headline font-bold text-xl ${percentTextClass}`}>{roundedPercent !== null ? `${roundedPercent}%` : '--'}</span>
      </div>
      <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
        <div className={`${barClass} h-full rounded-full`} style={{ width: `${Math.min(Math.max(roundedPercent ?? 0, 0), 100)}%` }}></div>
      </div>
      <div className="flex gap-2">
        {status === 'safe' && (
          <div className="bg-secondary-container/20 px-3 py-1.5 rounded-md flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
            <span className="text-[11px] font-medium text-on-secondary-container">Can skip: {Math.max(safeSkips, 0)} classes</span>
          </div>
        )}
        {status === 'warning' && (
          <div className="bg-tertiary-container/20 px-3 py-1.5 rounded-md flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-tertiary">warning</span>
            <span className="text-[11px] font-medium text-on-tertiary-container">At risk</span>
          </div>
        )}
        {status === 'danger' && (
          <div className="bg-error-container/20 px-3 py-1.5 rounded-md flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-error">report</span>
            <span className="text-[11px] font-medium text-error">Shortage</span>
          </div>
        )}
        {isEmpty && (
          <div className="bg-surface-container-high/40 px-3 py-1.5 rounded-md flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-on-surface-variant">schedule</span>
            <span className="text-[11px] font-medium text-on-surface-variant">No classes yet</span>
          </div>
        )}
        <div className="bg-surface-container-high/40 px-3 py-1.5 rounded-md flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-on-surface-variant">Attended: {attended}/{total}</span>
        </div>
      </div>
      {status === 'danger' && (
        <div className="mt-4 -mx-5 -mb-5 bg-error-container/90 py-2 px-5 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-on-error">info</span>
          <span className="text-[11px] font-bold text-on-error tracking-tight">Attend {Math.max(recoveryClasses, 0)} classes to recover ({minPercent}%)</span>
        </div>
      )}
    </div>
  )
}
