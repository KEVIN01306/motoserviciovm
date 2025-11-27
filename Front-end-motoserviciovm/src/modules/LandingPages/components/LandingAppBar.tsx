import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import {useGoTo} from '../../../hooks/useGoTo';
import LandingDrawer from './LandingDrawer';

type Props = { sections?: Array<{ name: string; href: string }> };

const LandingAppBar: React.FC<Props> = ({ sections = [] }) => {
  const [open, setOpen] = React.useState(false);
  const goTo = useGoTo();

const handleClick = (href: string) => {

    if (href.startsWith('/')) goTo(href);
    else document.querySelector(href as any)?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={3} sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="a" onClick={() => handleClick('#banner')} sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 800 }}>
            MOTOSERVICIO <span style={{ color: '#ff6600' }}>VM</span>
          </Typography>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div className="hide-mobile" style={{ display: 'none' }}>
              {/* reserved for desktop nav when needed */}
            </div>

            <Button variant="outlined" onClick={() => goTo('/public/auth/login')} sx={{ textTransform: 'none', fontWeight: 700 }}>
              Iniciar sesión
            </Button>

            <IconButton edge="end" color="inherit" onClick={() => setOpen(s => !s)} aria-label="menu">
              {open ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <LandingDrawer open={open} onClose={() => setOpen(false)} sections={sections} />
    </>
  );
};

export default LandingAppBar;
