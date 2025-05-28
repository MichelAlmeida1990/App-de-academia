// src/theme/muiTheme.js
import { createTheme } from '@mui/material/styles';

const getMuiTheme = (darkMode) => {
  return createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#8B5CF6' : '#6B46C1', // Cor primária para o modo dark/light
      },
      secondary: {
        main: darkMode ? '#2DD4BF' : '#14B8A6', // Cor secundária para o modo dark/light
      },
      background: {
        default: darkMode ? '#1F2937' : '#F3F4F6', // Cor de fundo padrão do corpo
        paper: darkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.5)', // Cor de fundo para Paper e Card (com transparência para glassmorphism)
      },
      text: {
        primary: darkMode ? '#E5E7EB' : '#1F2937', // Cor do texto principal
        secondary: darkMode ? '#A1A1AA' : '#6B7280', // Cor do texto secundário
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            // Estilos Glassmorphism
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)', // Para compatibilidade Safari
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s ease-in-out, border 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.02)', // Efeito de zoom no hover
              transition: 'transform 0.2s ease-in-out',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            // Aplicar Glassmorphism também para Paper (para as Tabs)
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s ease-in-out, border 0.3s ease-in-out',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            color: darkMode ? '#A1A1AA' : '#6B7280', // Cor do texto da aba
            '&.Mui-selected': {
              color: darkMode ? '#E5E7EB' : '#1F2937', // Cor do texto da aba selecionada
            },
          },
        },
      },
      MuiTimelineDot: {
        styleOverrides: {
          root: {
            backgroundColor: 'transparent', // Remover cor de fundo padrão
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: darkMode ? '#8B5CF6' : '#6B46C1', // Cor da borda
          },
          colorSuccess: {
            backgroundColor: darkMode ? '#2DD4BF' : '#14B8A6', // Cor do dot de sucesso
            borderColor: darkMode ? '#2DD4BF' : '#14B8A6',
          },
          colorGrey: {
            backgroundColor: darkMode ? '#6B7280' : '#D1D5DB', // Cor do dot cinza
            borderColor: darkMode ? '#6B7280' : '#D1D5DB',
          },
        },
      },
      MuiTimelineConnector: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#4B5563' : '#E5E7EB', // Cor do conector da timeline
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            // Garante que o Typography use a cor de texto definida no tema
            color: 'inherit',
          },
          colorTextSecondary: {
            color: darkMode ? '#A1A1AA' : '#6B7280',
          },
          colorPrimary: {
            color: darkMode ? '#8B5CF6' : '#6B46C1', // Ajusta cor primary para typography
          },
        },
      },
    },
  });
};

export default getMuiTheme;