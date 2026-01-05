import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { useAuthStore } from "../../../store/useAuthStore";
import MenuActions from "./MenuActions";


interface HeaderProps {
    drawerWidth: number;
    handleDrawerToggle: () => void;
    handleDrawerOpen: () => void;
    drawerOpen: boolean;
}

const Header = ({ drawerWidth, handleDrawerToggle, handleDrawerOpen, drawerOpen }: HeaderProps) => {
    const user = useAuthStore((state) => state.user);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };


    return (
        <AppBar
            position="fixed"
            sx={{
                width: { sm: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
                ml: { sm: drawerOpen ? `${drawerWidth}px` : 0 },
                mr: { sm: 1 },
                boxShadow: "none",
                backgroundColor: "transparent",
                color: "primary.main",
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(10px)",
                mt: 0,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                transition: 'width 0.3s, margin-left 0.3s',
            }}
        >
            <Toolbar>
                {/* Botón menú móvil */}
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: "none" } }}
                >
                    <MenuIcon />
                </IconButton>
                {/* Botón menú desktop (solo si el drawer está cerrado) */}
                {!drawerOpen && (
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerOpen}
                        sx={{ mr: 2, display: { xs: 'none', sm: 'inline-flex' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                <Typography variant="h6" noWrap component="div"></Typography>
            </Toolbar>

            <Toolbar>
                
            </Toolbar>

            <Toolbar
                sx={{
                    display: "flex",
                    gap: 5,
                    justifyContent: "flex-start",
                    alignItems: "center",
                }}
            >

                <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                    {user ? (
                        <Avatar variant="rounded" sx={{ backgroundColor: "#6060f3" }}>
                            {user?.primerNombre?.[0]?.toUpperCase() || "U"}
                        </Avatar>
                    ) : (
                        <Avatar variant="rounded" sx={{ backgroundColor: "gray" }} />
                    )}
                </IconButton>

                <MenuActions open={open} anchorEl={anchorEl} handleMenuClose={handleMenuClose}/>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
