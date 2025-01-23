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
      fontFamily: '"Lora", "Open Sans", serif',
      h1: { fontSize: '2.5rem', fontWeight: 700, color: '#333' },
      h2: { fontSize: '2rem', fontWeight: 600, color: '#444' },
      body1: { fontSize: '1rem', lineHeight: 1.6, color: '#555' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            margin: 0,
            padding: 0,
            fontFamily: '"Lora", "Open Sans", serif',
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
        },
      },
    },
    });
  };

export default createCustomTheme;
