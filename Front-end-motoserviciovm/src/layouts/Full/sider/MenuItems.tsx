import { PiUserCheckDuotone } from "react-icons/pi";
import { PiUsersDuotone } from "react-icons/pi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { AdminPanelSettings, AutoFixHighOutlined, HomeMaxOutlined, StoreMallDirectoryOutlined } from "@mui/icons-material";

const MenuItems = [
    {
        type: "divider",
        Text: "Panel",
        icon: AdminPanelSettings
    },
    {
        type: "modulo",
        name: "Home",
        link: "/admin",
        icon: HomeMaxOutlined,
        permiso: 'home:view'
    },
    {
        type: "divider",
        Text: "Administración",
        icon: MdOutlineAdminPanelSettings
    },
    {
        type: "modulo",
        name: "Sucursales",
        link: "/admin/sucursales",
        icon: StoreMallDirectoryOutlined,
        permiso: 'sucursales:view'
    },
    {
        type: "modulo",
        name: "Usuarios",
        link: "/admin/users",
        icon: PiUserCheckDuotone,
        permiso: 'usuarios:view'
    },
    {
        type: "modulo",
        name: "Roles",
        link: "/admin/roles",
        icon: PiUsersDuotone,
        permiso: 'roles:view'
    },
    {
        type: "modulo",
        name: "Permisos",
        link: "/admin/permisos",
        icon: AutoFixHighOutlined,
        permiso: 'permisos:view'
    },
]
export default MenuItems
