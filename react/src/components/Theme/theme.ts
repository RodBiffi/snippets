type PrivacyTheme = {
  purple: string;
  red: string;
  yellow: string;
  green: string;
  external: string;
};

declare module '@mui/material/styles' {
  interface Theme {
    privacy: PrivacyTheme;
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    privacy?: PrivacyTheme;
  }
}

const privacy = {
  purple: '#800080',
  red: '#ff0000',
  yellow: '#ffff00',
  green: '#008000',
  external: '#699CEF',
};

const darkPalette = {
  primary: {
    main: '#ffffff',
    light: '#FFECF3',
    dark: '#FFAFD6',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  secondary: {
    main: '#777777',
    light: '#FFECF3',
    dark: '#9f9e9e',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  error: {
    main: '#f6978a',
    light: '#e2a9a3',
    dark: '#FF897A',
    contrastText: '#680003',
  },
  warning: {
    main: '#FFA726',
    light: '#FFB74D',
    dark: '#F57C00',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  info: {
    main: '#29B6F6',
    light: '#4FC3F7',
    dark: '#0288D1',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  success: {
    main: '#66BB6A',
    light: '#81C784',
    dark: '#388E3C',
    contrastText: '#fff',
  },
  background: {
    backdrop: 'rgba(0, 0, 0, 0.2)',
    paper: '#424242',
    default: '#303030',
  },
};

const lightPalette = {
  primary: {
    light: '#D073A2',
    main: '#95416E',
    dark: '#5B113E',
    contrastText: '#fff',
  },
  secondary: {
    main: '#725762',
    light: '#A88895',
    dark: '#402A34',
    contrastText: '#fff',
  },
  error: {
    main: '#F44336',
    light: '#F88078',
    dark: '#E31B0C',
    contrastText: '#fff',
  },
  warning: {
    main: '#ED6C02',
    light: '#FFB547',
    dark: '#C77700',
    contrastText: '#fff',
  },
  info: {
    main: '#2196F3',
    light: '#64B6F7',
    dark: '#0B79D0',
    contrastText: '#fff',
  },
  success: {
    main: '#4CAF50',
    light: '#7BC67E',
    dark: '#3B873E',
    contrastText: '#fff',
  },
  background: {
    backdrop: 'rgba(255, 255, 255, 0.6)',
    paper: '#fff',
    default: '#fafafa',
  },
};

export const getDesignTokens = (mode: 'light' | 'dark') => ({
  privacy,
  palette: {
    mode,
    ...(mode === 'light' ? lightPalette : darkPalette),
  },
  components: {
    MuiChip: {
      styleOverrides: {
        icon: {
          order: 1,
          marginLeft: 0,
          marginRight: 4,
        },
      },
    },
  },
});
