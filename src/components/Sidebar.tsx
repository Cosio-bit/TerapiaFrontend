import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Menu,
  Users,
  UserCog,
  Calendar,
  Store,
  Building2,
  ChevronDown,
  X,
  DollarSign
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(() => {
    const saved = localStorage.getItem('activeDropdown')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    localStorage.setItem('activeDropdown', JSON.stringify(activeDropdown))
  }, [activeDropdown])

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name))
  }

  const navigation = [
    {
      name: 'Sesiones',
      icon: Calendar,
      items: [
        { name: 'Sesiones Individuales', href: '/sesiones' },
        { name: 'Sesiones Grupales', href: '/sesion-groups' }
      ]
    },
    {
      name: 'Personas',
      icon: Users,
      items: [
        { name: 'Clientes', href: '/clientes' },
        { name: 'Profesionales', href: '/profesionales' },
        { name: 'Fichas de Salud', href: '/fichas-salud' }
      ]
    },
    {
      name: 'Servicios',
      icon: UserCog,
      items: [
        { name: 'Terapias', href: '/terapias' },
        { name: 'Categorías', href: '/categorias' }
      ]
    },
    {
      name: 'Inventario',
      icon: Store,
      items: [
        { name: 'Productos', href: '/productos' },
        { name: 'Proveedores', href: '/proveedores' },
        { name: 'Compras', href: '/compras' },
        { name: 'Productos Comprados', href: '/productos-comprados' }
      ]
    },
    {
      name: 'Instalaciones',
      icon: Building2,
      items: [
        { name: 'Salas', href: '/salas' },
        { name: 'Arriendos', href: '/arriendos' }
      ]
    },
    {
      name: 'Administración',
      icon: DollarSign,
      items: [
        { name: 'Gastos', href: '/gastos' },
        { name: 'Resumen', href: '/resumen' },
        { name: 'Usuarios', href: '/usuarios' },
        { name: 'ManageCliente', href: '/manage-cliente' },
      ]
    }
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && window.innerWidth < 768 && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 40
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: 'fixed',
          top: '2.6rem',
          left: 0,
          height: 'calc(100vh - 2.6rem)',
          width: '260px',
          zIndex: 45,
          backgroundColor: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(6px)',
          borderRight: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          padding: '1rem',
          overflowY: 'auto',
          fontFamily: 'Montserrat, sans-serif',
          borderTopRightRadius: '10px',
          transition: 'transform 0.3s ease-in-out',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Menu size={20} color="#6366f1" />
            <span
              style={{
                marginLeft: '0.5rem',
                fontWeight: 600,
                fontSize: '1.1rem',
                color: '#1f2937'
              }}
            >
              
            </span>
          </div>
          {window.innerWidth < 768 && (
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '0.2rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              <X size={20} color="#6b7280" />
            </button>
          )}
        </div>

        {/* Navigation */}
        {navigation.map((section) => (
          <div key={section.name} style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => toggleDropdown(section.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '0.6rem 1rem',
                background: 'transparent',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 500,
                fontSize: '0.95rem',
                color:
                  activeDropdown === section.name ? '#4f46e5' : '#374151',
                backgroundColor:
                  activeDropdown === section.name
                    ? 'rgba(99,102,241,0.1)'
                    : 'transparent',
                cursor: 'pointer'
              }}
            >
              <section.icon size={18} style={{ marginRight: '0.5rem' }} />
              <span style={{ flexGrow: 1 }}>{section.name}</span>
              <ChevronDown
                size={16}
                style={{
                  transition: 'transform 0.2s ease',
                  transform:
                    activeDropdown === section.name
                      ? 'rotate(180deg)'
                      : 'rotate(0deg)'
                }}
              />
            </button>

            {/* Dropdown items */}
            <div
              style={{
                maxHeight: activeDropdown === section.name ? '300px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease',
                paddingLeft: activeDropdown === section.name ? '1.5rem' : '0',
                marginTop: activeDropdown === section.name ? '0.5rem' : '0'
              }}
            >
              {section.items.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => {
                    if (window.innerWidth < 768) setIsOpen(false)
                    setActiveDropdown(null)
                  }}
                  style={{
                    display: 'block',
                    padding: '0.4rem 0.5rem',
                    borderRadius: '5px',
                    fontSize: '0.875rem',
                    color:
                      location.pathname === item.href
                        ? '#4338ca'
                        : '#4b5563',
                    backgroundColor:
                      location.pathname === item.href
                        ? 'rgba(99,102,241,0.1)'
                        : 'transparent',
                    textDecoration: 'none',
                    marginBottom: '0.2rem'
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </aside>
    </>
  )
}

export default Sidebar
