import React, { useEffect, useState } from 'react'
import {
  CssBaseline,
  ThemeProvider,
  Box,
  Container,
  createTheme,
} from '@mui/material'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen')
    return saved ? JSON.parse(saved) : window.innerWidth >= 768
  })

  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }, [])

  const theme = createTheme({
    palette: {
      primary: { main: '#6CAFB7' },
      secondary: { main: '#FFD580' },
      background: {
        default: '#E8F0F2',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#2E3A59',
        secondary: '#4F5D75',
      },
      error: { main: '#D9534F' },
    },
    typography: {
      fontFamily: '"Noto Sans", sans-serif',
      h1: { fontSize: '2.8rem', fontWeight: 700 },
      h2: { fontSize: '2.2rem', fontWeight: 600 },
      h3: { fontSize: '1.8rem', fontWeight: 600 },
      body1: { fontSize: '1.125rem', lineHeight: 1.75 },
      button: { fontSize: '1rem', fontWeight: 600 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*, *::before, *::after': {
            boxSizing: 'border-box',
          },
          html: {
            fontSize: '16px',
            scrollBehavior: 'smooth',
          },
          body: {
            margin: 0,
            padding: 0,
            fontFamily: '"Noto Sans", sans-serif',
            backgroundColor: '#E8F0F2',
            color: '#2E3A59',
            minHeight: '100vh',
            width: '100%',
            overflowX: 'hidden',
          },
        },
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" minHeight="100vh" flexDirection="column">
        <Navbar toggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
        <Box display="flex" flex={1}>
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <Box
            component="main"
            sx={{
              flex: 1,
              mt: '2.6rem',
              ml: isSidebarOpen ? '260px' : '0px',
              p: 3,
              transition: 'margin 0.3s ease',
              backgroundColor: '#ffffffc9',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            <Container maxWidth="lg">
              <Outlet />
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default MainLayout
