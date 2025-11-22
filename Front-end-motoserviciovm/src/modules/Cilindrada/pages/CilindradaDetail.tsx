
import { useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { RiEdit2Line } from "react-icons/ri";
import { PiListNumbersBold } from "react-icons/pi";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { DetailData } from "../components";
import type { CilindradaType } from "../../../types/cilindradaType";
import { getCilindrada } from "../../../services/cilindrada.services";
import { useGoTo } from "../../../hooks/useGoTo";

const CilindradaDetail = () => {
    const { id } = useParams();
    const goTo = useGoTo();
    const [cilindrada, setCilindrada] = useState<CilindradaType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const getCilindradaOne = async () => {
        try {
            setLoading(true);
            const response = await getCilindrada(String(id));
            setCilindrada(response);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCilindradaOne();
    }, []);

    const breadcrumbsData = [
        { label: "Cilindradas", icon: <PiListNumbersBold fontSize="inherit" />, href: "/admin/cilindrada" },
        { label: `${cilindrada?.cilindrada ?? ""}`, icon: <PiListNumbersBold fontSize="inherit" />, href: `/admin/cilindrada/${id}` },
    ];

    if (loading) return <Loading />;
    if (error) return <ErrorCard errorText={error} restart={getCilindradaOne} />;
    if (!cilindrada) return <ErrorCard errorText="Cilindrada no encontrada" restart={getCilindradaOne} />;

    return (
        <>
            <BreadcrumbsRoutes items={breadcrumbsData} />
            <Grid container spacing={2}>
                <DetailData cilindrada={cilindrada} />
                <Grid size={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<RiEdit2Line />}
                        onClick={() => goTo(`/admin/cilindrada/${id}/edit`)}
                        fullWidth
                    >
                        Editar Cilindrada
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};

export default CilindradaDetail;
