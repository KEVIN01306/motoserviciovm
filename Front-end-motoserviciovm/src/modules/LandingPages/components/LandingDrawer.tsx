import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';

const LandingDrawer: React.FC<{ open: boolean; onClose: () => void; sections?: { name: string; href: string }[] }> = ({ open, onClose, sections = [] }) => {
  const navigate = useNavigate();

  const handleClick = (href: string) => {
    onClose();
    if (href.startsWith('/')) navigate(href);
    else document.querySelector(href as any)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div style={{ width: 300, padding: 12 }}>
        <List>
          {sections.map((s) => (
            <ListItem key={s.name} disablePadding>
              <ListItemButton onClick={() => handleClick(s.href)}>
                <ListItemText primary={s.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <div style={{ padding: 12 }}>
          <Button variant="contained" fullWidth href="/public/auth/login">Iniciar sesión</Button>
        </div>
      </div>
    </Drawer>
  );
};

export default LandingDrawer;
