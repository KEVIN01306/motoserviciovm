import { PiUserCheckDuotone, PiUsersDuotone, PiListNumbersBold, PiTrademarkRegisteredBold } from "react-icons/pi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { AdminPanelSettings, AutoFixHighOutlined, HomeMaxOutlined, StoreMallDirectoryOutlined } from "@mui/icons-material";
import { RiBikeFill } from "react-icons/ri";

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
        Text: "Motos",
        icon: RiBikeFill
    },
    {
        type: "modulo",
        name: "Líneas",
        link: "/admin/lineas",
        icon: PiListNumbersBold,
        permiso: 'lineas:view'
    },
    {
        type: "modulo",
        name: "Cilindradas",
        link: "/admin/cilindrada",
        icon: AutoFixHighOutlined,
        permiso: 'cilindradas:view'
    },
    {
        type: "modulo",
        name: "Marcas",
        link: "/admin/marcas",
        icon: PiTrademarkRegisteredBold,
        permiso: 'marcas:view'
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
