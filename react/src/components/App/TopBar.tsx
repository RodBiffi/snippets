import { FC, forwardRef, PropsWithChildren } from 'react';
import {
  AppBar,
  Box,
  Container,
  Link,
  Toolbar,
  Typography,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { Theme } from '@mui/system';
import { createStyles, makeStyles } from '@mui/styles';

interface DecoratedNavLinkProps {
  to: string;
  className: string;
  activeClassName: string;
}

const DecoratedNavLink = forwardRef<
  HTMLAnchorElement,
  PropsWithChildren<DecoratedNavLinkProps>
>((props, ref) => (
  <NavLink
    ref={ref}
    to={props.to}
    className={({ isActive }) =>
      `${props.className} ${isActive ? props.activeClassName : ''}`
    }
  >
    {props.children}
  </NavLink>
));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    activeLink: {
      color: theme.palette.primary.dark,
    },
  }),
);

const TopBar: FC = () => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar variant="dense" disableGutters>
          <Typography variant="h5" fontWeight="bold">
            <Link component={NavLink} to="/" underline="none">
              React sample
            </Link>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex' }, ml: 2, gap: 1 }}>
            <Typography fontWeight="bold">
              <Link
                component={DecoratedNavLink}
                to="/route1"
                underline="hover"
                activeClassName={classes.activeLink}
              >
                Route1
              </Link>
            </Typography>
            <Typography fontWeight="bold">
              <Link
                component={DecoratedNavLink}
                to="/route2"
                underline="hover"
                activeClassName={classes.activeLink}
              >
                Route2
              </Link>
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopBar;
