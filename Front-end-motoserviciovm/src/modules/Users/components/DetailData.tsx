import { Chip, Grid } from "@mui/material";
import DetailItem from "./DetailItem";
import { EventNote, MailOutline, PersonOutline, VpnKey } from "@mui/icons-material";
import type { UserGetType, UserType } from "../../../types/userType";
import { formatDate } from "../../../utils/formatDate";

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
        id,
        //password,
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
                            {/*<DetailItem
                                label="Fecha de Nacimiento"
                                value={formatDate(fechaNac)}
                                icon={<EventNote fontSize="small" />}
                            />*/}
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6}}>
                            <DetailItem
                                label="ID de Usuario"
                                value={id || 'N/A'}
                                icon={<VpnKey fontSize="small" />}
                            />

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
                        </Grid>
                    </Grid>

        </>
    )
}

export default DataDetail;