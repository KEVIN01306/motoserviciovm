
import { PiUserCheckDuotone } from "react-icons/pi";

const MenuItems = [
    /*{
        name: "Games",
        link: "/games",
        icon: PiGameControllerFill,
        roles: ['admin','user']
    },*/
    {
        name: "Usuarios",
        link: "/admin/users",
        icon: PiUserCheckDuotone,
        permiso: 'usuarios:view'
    }
]

export default MenuItems