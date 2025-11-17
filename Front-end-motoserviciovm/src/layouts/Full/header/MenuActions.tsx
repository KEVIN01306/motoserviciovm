import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import Divider from "@mui/material/Divider";
import { useGoTo } from "../../../hooks/useGoTo";
import { useAuthStore } from "../../../store/useAuthStore";

interface MenuActionsProps {
    open: boolean;
    anchorEl: null | HTMLElement;
    handleMenuClose: () => void;
}

const MenuActions = ({open,anchorEl,handleMenuClose}:MenuActionsProps) => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const goTo = useGoTo()

    const handleLogout = () => {
        logout();
        handleMenuClose();
        goTo("/public/auth/login");
    };
    return (
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                {user ? (
                    <>
                        <MenuItem
                            onClick={() => {
                                goTo(`/admin/users/${user.id}`);
                                handleMenuClose();
                            }}
                        >
                            <ListItemIcon>
                                <AccountCircleIcon fontSize="small" />
                            </ListItemIcon>
                            Profile
                        </MenuItem>

                        <Divider />

                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            Log Out
                        </MenuItem>
                    </>
                ) : (
                    <>
                        <MenuItem
                            onClick={() => {
                                goTo("/public/auth/login");
                                handleMenuClose();
                            }}
                        >
                            <ListItemIcon>
                                <LoginIcon fontSize="small" />
                            </ListItemIcon>
                            Sign In
                        </MenuItem>
                    </>
                )}
            </Menu>
    )
}

export default MenuActions;