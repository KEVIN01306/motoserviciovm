import BreadcrumbsRoutes from "../../../components/utils/Breadcrumbs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { getProducto } from "../../../services/producto.services";
import DetailData from "../components/DetailData";
import type { ProductoGetType } from "../../../types/productoType";
import { IoCubeSharp } from "react-icons/io5";

const ProductoDetail = () => {
    const { id } = useParams();

    const [item, setItem] = useState<ProductoGetType | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const breadcrumbsData = [
        { label: "Productos", icon: <IoCubeSharp fontSize="inherit" />, href: "/admin/productos" },
        { label: "Detalle Producto", icon: <IoCubeSharp fontSize="inherit" />, href: "/admin/productos/" + id },
    ];

    const getOne = async () => {
        try {
            setLoading(true);
            const response = await getProducto(id as any);
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
            <DetailData producto={item} id={id} />
        </>
    );
};

export default ProductoDetail;
