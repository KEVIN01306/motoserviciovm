import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { getInventario } from "../../../services/inventario.services";
import DetailData from "../components/DetailData";
import type { InventarioType } from "../../../types/inventarioType";
import { RiBox1Fill } from "react-icons/ri";
import { Button, Grid } from "@mui/material";

const InventarioDetail = () => {
    const { id } = useParams();

    const [item, setItem] = useState<InventarioType | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const breadcrumbsData = [
        { label: "Inventarios", icon: <RiBox1Fill fontSize="inherit" />, href: "/admin/inventarios" },
        { label: "Detalle Inventario", icon: <RiBox1Fill fontSize="inherit" />, href: "/admin/inventarios/" + id },
    ];

    const getOne = async () => {
        try {
            setLoading(true);
            const response = await getInventario(id as any);
            setItem(response);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOne();
    }, []);

    if (loading) return <Loading />;
    if (error) return <ErrorCard errorText={error} restart={getOne} />;

    return (
        <>
            <BreadcrumbsRoutes items={breadcrumbsData} />
            <DetailData item={item} />

            <Grid container spacing={2} marginTop={2}>
                <Button variant="contained" href={`/admin/inventarios/${id}/edit`} fullWidth>
                    Editar Inventario
                </Button>
            </Grid>
        </>
    );
};

export default InventarioDetail;
