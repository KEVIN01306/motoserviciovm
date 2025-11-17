import { PiUserCheckDuotone } from "react-icons/pi";
import { PiUsersDuotone } from "react-icons/pi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { AutoFixHighOutlined } from "@mui/icons-material";

const MenuItems = [
    {
        type: "divider",
        Text: "Administración",
        icon: MdOutlineAdminPanelSettings
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
    }
]
export default MenuItems
