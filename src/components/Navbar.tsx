import React from 'react'
import { Menu } from 'lucide-react'

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 50,
        padding: '0.4rem 1rem',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '1rem',
        backdropFilter: 'blur(6px)',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }}
    >
      <button
        onClick={toggleSidebar}
        aria-label="Abrir menú"
        style={{
          padding: '0.3rem',
          borderRadius: '6px',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <Menu size={20} color="#555" />
      </button>

      <h1
        style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          fontFamily: "'Montserrat', sans-serif",
          color: '#333',
          letterSpacing: '-0.5px',
        }}
      >
        Centro Terapia
      </h1>
    </nav>
  )
}

export default Navbar
