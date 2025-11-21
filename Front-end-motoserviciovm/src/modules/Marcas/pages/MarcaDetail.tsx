import { useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { RiEdit2Line } from "react-icons/ri";
import { PiTrademarkRegisteredBold } from "react-icons/pi";
import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { DetailData } from "../components";
import type { MarcaType } from "../../../types/marcaType";
import { getMarca } from "../../../services/marca.services";
import { useGoTo } from "../../../hooks/useGoTo";

const MarcaDetail = () => {
    const { id } = useParams();
    const goTo = useGoTo();
    const [marca, setMarca] = useState<MarcaType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const getMarcaOne = async () => {
        try {
            setLoading(true);
            const response = await getMarca(id);
            setMarca(response);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMarcaOne();
    }, []);

    const breadcrumbsData = [
        { label: "Marcas", icon: <PiTrademarkRegisteredBold fontSize="inherit" />, href: "/admin/marcas" },
        { label: marca?.marca ?? "", icon: <PiTrademarkRegisteredBold fontSize="inherit" />, href: `/admin/marcas/${id}` },
    ];

    if (loading) return <Loading />;
    if (error) return <ErrorCard errorText={error} restart={getMarcaOne} />;
    if (!marca) return <ErrorCard errorText="Marca no encontrada" restart={getMarcaOne} />;

    return (
        <>
            <BreadcrumbsRoutes items={breadcrumbsData} />
            <Grid container spacing={2}>
                <DetailData marca={marca} />
                <Grid size={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<RiEdit2Line />}
                        onClick={() => goTo(`/admin/marcas/${id}/edit`)}
                        fullWidth
                    >
                        Editar Marca
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};

export default MarcaDetail;

