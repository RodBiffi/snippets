import { FC, PropsWithChildren, useMemo } from 'react';
import { StyledEngineProvider } from '@mui/material/styles';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';

import { getDesignTokens } from './theme';
import { ThemeContextProvider, useThemeContext } from './ThemeContext';

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useThemeContext();

  const muiTheme = useMemo(() => createTheme(getDesignTokens(theme)), [theme]);

  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
    </StyledEngineProvider>
  );
};

const withThemeContext: FC<PropsWithChildren> = (props) => (
  <ThemeContextProvider>
    <ThemeProvider {...props} />
  </ThemeContextProvider>
);

export default withThemeContext;
