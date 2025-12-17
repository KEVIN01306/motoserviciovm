import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { getEnParqueo } from "../../../services/enParqueo.services";
import DetailData from "../components/DetailData";
import { useGoTo } from "../../../hooks/useGoTo";

const EnParqueoDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const goTo = useGoTo();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await getEnParqueo(Number(id));
          setItem(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorCard errorText={error} restart={() => window.location.reload()} />;

  return item ? <DetailData item={item} /> : null;
};

export default EnParqueoDetail;