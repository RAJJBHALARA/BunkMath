import { useLocation, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { id: 'dash', label: 'Dash', icon: 'grid_view', path: '/dashboard', filled: true },
  { id: 'subjects', label: 'Subjects', icon: 'book_5', path: '/dashboard' },
  { id: 'stats', label: 'Stats', icon: 'analytics', path: '/stats' },
  { id: 'profile', label: 'Profile', icon: 'person', path: '/profile' },
]

export default function BottomNav({ active }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Auto-detect active tab if not passed
  const currentActive = active || (() => {
    if (location.pathname === '/stats') return 'stats'
    if (location.pathname === '/profile') return 'profile'
    return 'dash'
  })()

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[80%] z-50 flex justify-around items-center px-6 py-3 bg-[#131319]/20 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-[0_10px_40px_rgba(124,58,237,0.2)]">
      {NAV_ITEMS.map((item) => {
        const isActive = currentActive === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => navigate(item.path)}
            className={
              isActive
                ? "flex flex-col items-center justify-center text-[#bd9dff] relative after:content-[''] after:absolute after:-bottom-1 after:w-1 after:h-1 after:bg-[#bd9dff] after:rounded-full transition-all duration-200 scale-90 active:scale-75"
                : "flex flex-col items-center justify-center text-[#acaab1]/60 hover:text-[#bd9dff] transition-all duration-200 scale-90 active:scale-75"
            }
          >
            <span
              className="material-symbols-outlined"
              style={isActive && item.filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="font-label font-medium text-[10px] tracking-wider uppercase mt-0.5">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
