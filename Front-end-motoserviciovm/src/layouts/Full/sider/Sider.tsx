import Drawer from "@mui/material/Drawer"
import ItemsSider from "./ItemsSider"
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface SiderProps {
  window?: () => Window;
  handleDrawerClose: () => void;
  mobileOpen: boolean;
  drawerOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const drawerWidth = 200;
const drawerWidthMobil = 240;

const Sider = ({ handleDrawerClose, mobileOpen, drawerOpen, setMobileOpen, window }: SiderProps) => {

  const container = window !== undefined ? () => window().document.body : undefined;
    return(
        <>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            display: { xs: 'block', sm: 'none'},
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidthMobil, bgcolor: "rgb(251, 251, 252)" },
            borderRadius: 4,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            color: 'primary.main',
          }}
          ModalProps={{ keepMounted: true }}
        >
            <ItemsSider/>
        </Drawer>
        <Drawer
          variant="persistent"
          open={drawerOpen}
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', border: 'none', width: drawerWidth, bgcolor: "rgb(251, 251, 252)" },
            transition: 'width 0.3s',
          }}
        >
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: 0 }}>
            <IconButton onClick={handleDrawerClose} sx={{ m: 0.5, bgcolor: 'transparent', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <ItemsSider/>
        </Drawer>
        </>
    )
}

export default Sider;