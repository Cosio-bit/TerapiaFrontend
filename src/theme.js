import { createTheme } from '@mui/material/styles';

const createCustomTheme = (backgroundImage) => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  return createTheme({
    palette: {
      primary: {
        main: '#C0E7B8', // Mint Green
      },
      secondary: {
        main: '#F7C1B2', // Peach Pink
      },
      background: {
        default: '#FFEBD4', // Warm Beige
        paper: '#FFFFFF', // For cards and containers
      },
      text: {
        primary: '#333', // Dark Gray
        secondary: '#555', // Softer Gray
      },
    },
    typography: {
      fontFamily: '"Montserrat", sans-serif',
      h1: { fontSize: '5rem', fontWeight: 700, color: '#333' }, // Quadrupled size
      h2: { fontSize: '5rem', fontWeight: 600, color: '#444' }, // Quadrupled size
      body1: { fontSize: '1.2rem', lineHeight: 1.6, color: '#555' }, // Quadrupled size
      button: { fontSize: '1.3rem', fontWeight: 500 }, // Increased font size for buttons
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
          },
          '#overlay': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Transparent white overlay
            zIndex: 1, // Ensures it's between the background and content
          },
          '.MuiButton-root': {
            fontSize: '3rem', // Increased font size for all buttons
          },
          '.MuiTypography-h6': {
            fontSize: '4rem', // Increased font size for navbar title
            fontWeight: 700,
            fontFamily: '"Montserrat", sans-serif',
          },
        },
      },
    },
  });
};

export default createCustomTheme;
