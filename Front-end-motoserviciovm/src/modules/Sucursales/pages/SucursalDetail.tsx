import { PiStorefrontBold } from "react-icons/pi";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { getSucursal } from "../../../services/sucursal.services";
import type { SucursalType } from "../../../types/sucursalType";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { Button, Grid } from "@mui/material";
import { useGoTo } from "../../../hooks/useGoTo";
import DetailData from "../components/DetailData";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RiEdit2Line } from "react-icons/ri";

const SucursalDetail = () => {
    const { id } = useParams()
    const goTo = useGoTo()
    const [sucursal, setSucursal] = useState<SucursalType | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const getSucursalOne = async () => {
        try {
            setLoading(true)
            const response = await getSucursal(id);
            setSucursal(response);
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getSucursalOne()
    }, [id])

    const breadcrumbsData = [
        { label: "Sucursales", icon: <PiStorefrontBold fontSize="inherit" />, href: "/admin/sucursales" },
        { label: sucursal?.nombre ? sucursal.nombre : "", icon: <PiStorefrontBold fontSize="inherit" />, href: `/admin/sucursales/${id}` },
    ];

    if (loading) return <Loading />
    if (error) return <ErrorCard errorText={error} restart={getSucursalOne} />
    if (!sucursal) return <ErrorCard errorText="Sucursal no encontrada" restart={getSucursalOne} />

    return (
        <>
            <BreadcrumbsRoutes items={breadcrumbsData} />
            <Grid container spacing={2}>
                <DetailData sucursal={sucursal} />
                <Grid size={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<RiEdit2Line />}
                        onClick={() => goTo(`/admin/sucursales/${id}/edit`)}
                        fullWidth
                    >
                        Editar Sucursal
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}

export default SucursalDetail
