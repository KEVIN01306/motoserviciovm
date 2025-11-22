import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { getModelo } from "../../../services/modelo.services";
import DetailData from "../components/DetailData";
import { Grid, Button } from "@mui/material";
import { useGoTo } from "../../../hooks/useGoTo";
import type { modeloGetType } from "../../../types/modeloType";
import { RiEBikeLine } from "react-icons/ri";

const ModeloDetail = () => {
    const { id } = useParams();
    const goTo = useGoTo();

    const [modelo, setModelo] = useState<modeloGetType | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const breadcrumbsData = [
        { label: "Modelos", icon: <RiEBikeLine fontSize="inherit" />, href: "/admin/modelos" },
        { label: "Detalle Modelo", icon: <RiEBikeLine fontSize="inherit" />, href: "/admin/modelos/" + id },
    ];

    const getOne = async () => {
        try {
            setLoading(true);
            const response = await getModelo(id as any);
            setModelo(response);
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
            <DetailData
                title={modelo?.modelo ?? "Modelo"}
                rows={[
                    { label: "Año", value: modelo?.año },
                    { label: "Marca", value: modelo?.marca?.marca },
                    { label: "Línea", value: modelo?.linea?.linea },
                    { label: "Cilindrada", value: modelo?.cilindrada?.cilindrada },
                    { label: "Estado", value: modelo?.estado?.estado },
                    { label: "Creado el", value: modelo?.createdAt },
                    { label: "Actualizado el", value: modelo?.updatedAt },
                ]}
            >
                <Grid size={12}>
                    <Button variant="contained" onClick={() => goTo("/admin/modelos/" + id + "/edit")}>
                        Editar
                    </Button>
                </Grid>
            </DetailData>
        </>
    );
};

export default ModeloDetail;
