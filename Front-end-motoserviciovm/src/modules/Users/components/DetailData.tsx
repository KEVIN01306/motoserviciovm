import { Box, Button, Chip, Divider, Grid, Typography } from "@mui/material";
import DetailItem from "./DetailItem";
import { Celebration, DateRangeOutlined, DateRangeTwoTone, MailOutline, PersonOutline, PhoneAndroidOutlined, PhoneEnabledSharp, StoreMallDirectoryRounded, VpnKey } from "@mui/icons-material";
import type { UserGetType } from "../../../types/userType";
import { PiTarget } from "react-icons/pi";
import { useGoTo } from "../../../hooks/useGoTo";
import { formatDateNotFormat } from "../../../utils/formatDate";

interface DataDetail {
    user: UserGetType;
}

const DataDetail = ({ user }: DataDetail) => {
    const {
        primerNombre,
        segundoNombre,
        primerApellido,
        segundoApellido,
        email,
        roles,
        sucursales,
        fechaNac,
        activo,
        numeroTel,
        numeroAuxTel,
        //tipo,
        dpi,
        nit,
        //id,
        //password,
        createdAt,
        updatedAt
    } = user;

    const goTo = useGoTo();

    const rolesString = roles.map(role => role.rol).join(',');
    const sucursalesString = sucursales.map(sucursal => sucursal.nombre).join(' / ');
    console.log(sucursalesString);
    const fullName = `${primerNombre || ''} ${segundoNombre || ''} ${primerApellido || ''} ${segundoApellido || ''}`.trim();
    return (
        <>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <DetailItem
                        label="Nombre Completo"
                        value={fullName}
                        icon={<PersonOutline fontSize="small" />}
                    />
                    <DetailItem
                        label="Correo Electrónico"
                        value={email || 'N/A'}
                        icon={<MailOutline fontSize="small" />}
                    />
                    {
                        dpi && (
                            <DetailItem
                                label="DPI"
                                value={dpi || 'N/A'}
                                icon={<PiTarget fontSize="small" />}
                            />
                        )
                    }
                    {

                        nit && (
                            <DetailItem
                                label="Nit"
                                value={nit || 'N/A'}
                                icon={<PiTarget fontSize="small" />}
                            />
                        )
                    }
                    <DetailItem
                        label="Fecha de Nacimiento"
                        value={fechaNac ? formatDateNotFormat(fechaNac) : 'N/A'}
                        icon={<Celebration fontSize="small" />}
                    />
                    <DetailItem
                        label="Número de Teléfono"
                        value={numeroTel || 'N/A'}
                        icon={<PhoneAndroidOutlined fontSize="small" />}
                    />
                    <DetailItem
                        label="Número de Teléfono Auxiliar"
                        value={numeroAuxTel || 'N/A'}
                        icon={<PhoneEnabledSharp fontSize="small" />}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>


                    <DetailItem
                        label="Roles"
                        value={rolesString || 'N/A'}
                        icon={<VpnKey fontSize="small" />}
                    />
                    <DetailItem
                        label="Estado"
                        value={
                            <Chip
                                label={activo ? "Activo" : "Inactivo"}
                                size="small"
                                color={activo ? "success" : "error"}
                            />
                        }
                        icon={<VpnKey fontSize="small" />}
                    />

                    <DetailItem
                        label="Creado el"
                        value={
                            createdAt
                                ? new Date(createdAt).toLocaleDateString()
                                : 'N/A'
                        }
                        icon={<DateRangeOutlined fontSize="small" />}
                    />
                    <DetailItem
                        label="Actualizado el"
                        value={
                            updatedAt
                                ? new Date(updatedAt).toLocaleDateString()
                                : 'N/A'
                        }
                        icon={<DateRangeTwoTone fontSize="small" />}
                    />
                    <DetailItem
                        label="Sucursales"
                        value={sucursalesString || 'N/A'}
                        icon={<StoreMallDirectoryRounded fontSize="small" />}
                    />
                </Grid>


            </Grid>
            
            <Divider sx={{ my: 1 }} />


            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    Usuarios asignados
                </Typography>

                {user.motos?.map((moto) => (
                    <Grid key={moto.id} size={12}>
                        <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "space-between" }}>
                            <Box>
                                <Typography sx={{ fontWeight: 600 }}>{moto.placa}</Typography>
                            </Box>
                            <Box>
                                <Button variant="outlined" onClick={() => goTo(`/admin/motos/${moto.id}`)}>
                                    Ver Moto
                                </Button>
                            </Box>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                    </Grid>
                ))}
            </Box>

        </>
    )
}

export default DataDetail;