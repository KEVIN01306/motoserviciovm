import { PiUserCheckDuotone, PiUsersDuotone, PiListNumbersBold, PiTrademarkRegisteredBold, PiCylinderBold, PiCashRegisterDuotone } from "react-icons/pi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { AutoFixHighOutlined, StoreMallDirectoryOutlined } from "@mui/icons-material";
import { RiBikeFill, RiEBikeLine, RiProductHuntLine } from "react-icons/ri";
import { IoCubeSharp } from "react-icons/io5";
import { AiTwotoneHome } from "react-icons/ai"; screenTop
/**
 * Grouped menu structure: each entry is a module group with a title and children items.
 */
const MenuItems = [

    // Orden original respetado, agrupando primero los items individuales en el orden dado
    { name: "INGRESO", link: "/admin/servicios", icon: AutoFixHighOutlined, permiso: "servicios:view" },
    { name: "VENTAS", link: "/admin/ventas", icon: RiProductHuntLine, permiso: "ventas:view" },
    { name: "INGRESOS/EGRESOS", link: "/admin/ingresos-egresos", icon: PiListNumbersBold, permiso: "ingresos-egresos:view" },
    { name: "CONTABILIDAD", link: "/admin/contabilidad", icon: PiCashRegisterDuotone, permiso: "contabilidad:view" },
    { name: "MOTOS", link: "/admin/motos", icon: RiBikeFill, permiso: "motos:view" },
    { name: "HORARIOS", link: "/admin/horarios", icon: AutoFixHighOutlined, permiso: "motos:view" },
    { name: "CITAS", link: "/admin/citas", icon: AiTwotoneHome, permiso: "citas:view" },
    {
        module: "MOTOS",
        icon: RiBikeFill,
        children: [
            { name: "LÍNEAS", link: "/admin/lineas", icon: PiListNumbersBold, permiso: "lineas:view" },
            { name: "CILINDRADAS", link: "/admin/cilindrada", icon: PiCylinderBold, permiso: "cilindradas:view" },
            { name: "MARCAS", link: "/admin/marcas", icon: PiTrademarkRegisteredBold, permiso: "marcas:view" },
            { name: "MODELOS", link: "/admin/modelos", icon: RiEBikeLine, permiso: "modelos:view" },
            { name: "EN PARQUEO", link: "/admin/enparqueo", icon: RiBikeFill, permiso: "enparqueo:view" },
            { name: "EN REPARACIÓN", link: "/admin/enreparacion", icon: IoCubeSharp, permiso: "enreparacion:view" },
        ]
    },
    // Luego los módulos en el orden dado
    {
        module: "SERVICIOS",
        icon: AutoFixHighOutlined,
        children: [
            { name: "OPCIONES DE SERVICIO", link: "/admin/opcionservicio", icon: PiListNumbersBold, permiso: "opcioneservicios:view" },
            { name: "TIPOS DE SERVICIO", link: "/admin/tiposervicio", icon: PiListNumbersBold, permiso: "tiposervicios:view" },
            { name: "INVENTARIOS", link: "/admin/inventarios", icon: IoCubeSharp, permiso: "inventarios:view" },
        ]
    },

    {
        module: "PRODUCTOS",
        icon: IoCubeSharp,
        children: [
            { name: "CATEGORÍAS DE PRODUCTO", link: "/admin/categoriaproducto", icon: PiListNumbersBold, permiso: "categoriaproducto:view" },
            { name: "PRODUCTOS", link: "/admin/productos", icon: IoCubeSharp, permiso: "productos:view" },
        ],
    },
    {
        module: "ADMINISTRACIÓN",
        icon: MdOutlineAdminPanelSettings,
        children: [
            { name: "SUCURSALES", link: "/admin/sucursales", icon: StoreMallDirectoryOutlined, permiso: "sucursales:view" },
            { name: "USUARIOS", link: "/admin/users", icon: PiUserCheckDuotone, permiso: "usuarios:view" },
            { name: "ROLES", link: "/admin/roles", icon: PiUsersDuotone, permiso: "roles:view" },
            { name: "PERMISOS", link: "/admin/permisos", icon: AutoFixHighOutlined, permiso: "permisos:view" },
        ],
    },
    {
    module: "CUSTOM",
            icon: MdOutlineAdminPanelSettings,
            children: [
                { name: "SLIDE", link: "/admin/customize-landing/slides", icon: StoreMallDirectoryOutlined, permiso: "customize-landing:slideManagemente" },
                { name: "IMÁGENES NOSOTROS", link: "/admin/customize-landing/about-images", icon: StoreMallDirectoryOutlined, permiso: "customize-landing:aboutImageManagemente" },
                { name: "VALORES", link: "/admin/customize-landing/valores", icon: StoreMallDirectoryOutlined, permiso: "customize-landing:valorManagemente" },
                { name: "CONTACTO", link: "/admin/customize-landing/contacto", icon: StoreMallDirectoryOutlined, permiso: "customize-landing:contactoManagemente" },
                { name: "TEXTOS", link: "/admin/customize-landing/textos", icon: StoreMallDirectoryOutlined, permiso: "customize-landing:textoManagemente" },
            ],
        },
    { name: "HOME", link: "/admin", icon: AiTwotoneHome, permiso: "home:view" },
];

export default MenuItems;
