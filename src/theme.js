import { createTheme } from '@mui/material/styles'

const createCustomTheme = (backgroundImage) => {
  const link = document.createElement('link')
  link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap'
  link.rel = 'stylesheet'
  document.head.appendChild(link)

  return createTheme({
    palette: {
      primary: { main: '#C0E7B8' },
      secondary: { main: '#F7C1B2' },
      background: {
        default: '#FFEBD4',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#333',
        secondary: '#555',
      },
    },
    typography: {
      fontFamily: '"Montserrat", sans-serif',
      h1: { fontSize: '3rem', fontWeight: 700, color: '#333' },
      h2: { fontSize: '2.5rem', fontWeight: 600, color: '#444' },
      body1: { fontSize: '1rem', lineHeight: 1.6, color: '#555' },
      button: { fontSize: '1rem', fontWeight: 500 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            margin: 0,
            padding: 0,
            fontFamily: '"Montserrat", sans-serif',
            backgroundImage: `url(${backgroundImage})`,
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            width: '100%',
            boxSizing: 'border-box',
            overflowX: 'hidden',
          },
          '#overlay': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1,
          },
          '.MuiButton-root': {
            fontSize: '1rem',
          },
          '.MuiTypography-h6': {
            fontSize: '1.2rem',
            fontWeight: 700,
            fontFamily: '"Montserrat", sans-serif',
          },
        },
      },
    },
  })
}

export default createCustomTheme
