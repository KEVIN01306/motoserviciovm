import { PiUserCheckDuotone, PiUsersDuotone, PiListNumbersBold, PiTrademarkRegisteredBold, PiCylinderBold } from "react-icons/pi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { AdminPanelSettings, AutoFixHighOutlined, HomeMaxOutlined, StoreMallDirectoryOutlined } from "@mui/icons-material";
import { RiBikeFill, RiEBikeLine } from "react-icons/ri";

/**
 * Grouped menu structure: each entry is a module group with a title and children items.
 */
const MenuItems = [
    {
        module: "Panel",
        icon: AdminPanelSettings,
        children: [
            { name: "Home", link: "/admin", icon: HomeMaxOutlined, permiso: "home:view" },
        ],
    },
    {
        module: "Motos",
        icon: RiBikeFill,
        children: [
            { name: "Líneas", link: "/admin/lineas", icon: PiListNumbersBold, permiso: "lineas:view" },
            { name: "Cilindradas", link: "/admin/cilindrada", icon: PiCylinderBold, permiso: "cilindradas:view" },
            { name: "Marcas", link: "/admin/marcas", icon: PiTrademarkRegisteredBold, permiso: "marcas:view" },
            { name: "Modelos", link: "/admin/modelos", icon: RiEBikeLine, permiso: "modelos:view" },
            { name: "Motos", link: "/admin/motos", icon: RiBikeFill, permiso: "motos:view" },
        ],
    },
    {
        module: "Administración",
        icon: MdOutlineAdminPanelSettings,
        children: [
            { name: "Sucursales", link: "/admin/sucursales", icon: StoreMallDirectoryOutlined, permiso: "sucursales:view" },
            { name: "Usuarios", link: "/admin/users", icon: PiUserCheckDuotone, permiso: "usuarios:view" },
            { name: "Roles", link: "/admin/roles", icon: PiUsersDuotone, permiso: "roles:view" },
            { name: "Permisos", link: "/admin/permisos", icon: AutoFixHighOutlined, permiso: "permisos:view" },
        ],
    },
];

export default MenuItems;
