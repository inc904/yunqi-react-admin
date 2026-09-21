import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import './Drawer.css'

export function Drawer({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside className="drawer" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose}>
            <X />
          </button>
        </header>
        {children}
      </aside>
    </div>
  )
}
