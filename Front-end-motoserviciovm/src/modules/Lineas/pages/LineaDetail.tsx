import { useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { RiEdit2Line } from "react-icons/ri";
import { PiListNumbersBold } from "react-icons/pi";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { DetailData } from "../components";
import type { LineaType } from "../../../types/lineaType";
import { getLinea } from "../../../services/linea.services";
import { useGoTo } from "../../../hooks/useGoTo";

const LineaDetail = () => {
    const { id } = useParams();
    const goTo = useGoTo();
    const [linea, setLinea] = useState<LineaType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const getLineaOne = async () => {
        try {
            setLoading(true);
            const response = await getLinea(id);
            setLinea(response);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLineaOne();
    }, []);

    const breadcrumbsData = [
        { label: "Líneas", icon: <PiListNumbersBold fontSize="inherit" />, href: "/admin/lineas" },
        { label: linea?.linea ?? "", icon: <PiListNumbersBold fontSize="inherit" />, href: `/admin/lineas/${id}` },
    ];

    if (loading) return <Loading />;
    if (error) return <ErrorCard errorText={error} restart={getLineaOne} />;
    if (!linea) return <ErrorCard errorText="Línea no encontrada" restart={getLineaOne} />;

    return (
        <>
            <BreadcrumbsRoutes items={breadcrumbsData} />
            <Grid container spacing={2}>
                <DetailData linea={linea} />
                <Grid size={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<RiEdit2Line />}
                        onClick={() => goTo(`/admin/lineas/${id}/edit`)}
                        fullWidth
                    >
                        Editar Línea
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};

export default LineaDetail;

