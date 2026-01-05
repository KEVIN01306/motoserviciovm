import { Outlet } from 'react-router-dom';
import Sider from './sider/Sider';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './header/Header';
import Toolbar from '@mui/material/Toolbar';
import { useState } from 'react';
import Footer from './sider/Footer';

const drawerWidth = 200;

const FullLayout = () => {
    // drawerOpen controla ambos: PC y móvil
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Para móvil
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    // Para PC
    const handleDrawerOpen = () => setDrawerOpen(true);
    const handleDrawerClose = () => setDrawerOpen(false);
    
    return (
        <>
            <Box sx={{ display: 'flex', bgcolor: "rgb(251, 251, 252)",minHeight: "100vh"
             }}>
                <CssBaseline />
                <Header drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen} />
                <Box
                    component="nav"
                    sx={{ width: { sm: drawerOpen ? drawerWidth : 0 }, flexShrink: { sm: 0 }, transition: 'width 0.3s' }}
                    aria-label="mailbox folders"
                >
                    <Sider
                        handleDrawerClose={handleDrawerClose}
                        mobileOpen={mobileOpen}
                        drawerOpen={drawerOpen}
                        setMobileOpen={setMobileOpen}
                    />
                </Box>
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, width: { xs: '100%', sm: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%' }, transition: 'width 0.3s' }}
                >
                    <Toolbar />
                    <Box display={"flex"} width={"100%"} flexWrap={"wrap"} justifyContent={"center"} flexDirection={'column'} alignContent={"center"}position={"relative"}>
                        <Outlet />
                    </Box>
                    <Footer/>
                </Box>
            </Box>
        </>
    )
}

export default FullLayout;


//<Box display={"flex"} flexWrap={"wrap"} justifyContent={"center"} flexDirection={'column'} alignContent={"center"}position={"relative"}>

//                    </Box>