import { Chip, Grid } from "@mui/material";
import DetailItem from "./DetailItem";
import { Celebration, DateRangeOutlined, DateRangeTwoTone, MailOutline, PersonOutline, PhoneAndroidOutlined, PhoneEnabledSharp, VpnKey } from "@mui/icons-material";
import type { UserGetType } from "../../../types/userType";
import { PiTarget } from "react-icons/pi";

interface DataDetail{
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

    const rolesString = roles.map(role => role.rol).join(',');

     const fullName = `${primerNombre || ''} ${segundoNombre || ''} ${primerApellido || ''} ${segundoApellido || ''}`.trim();
    return (
        <>
             <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6}}>
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
                                value={new Date(fechaNac).toLocaleDateString() || 'N/A'}
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

                        <Grid size={{ xs: 12, sm: 6}}>
                           

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
                        </Grid>
                    </Grid>

        </>
    )
}

export default DataDetail;