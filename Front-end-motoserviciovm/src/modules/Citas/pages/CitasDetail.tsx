import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BreadcrumbsRoutes from '../../../components/utils/Breadcrumbs';
import { getCita } from '../../../services/citas.services';

const CitasDetail = ()=>{
  const { id } = useParams();
  const [cita, setCita] = useState<any>(null);
  useEffect(()=>{ (async ()=>{ if(!id) return; try{ const c = await getCita(Number(id)); setCita(c);}catch(e){} })(); },[id]);
  if(!cita) return <>Cargando...</>;
  return (
    <>
      <BreadcrumbsRoutes items={[{ label: 'Citas', href: '/admin/citas'}, { label: 'Detalle' }]} />
      <div>
        <h3>Detalle cita #{cita.id}</h3>
        <p>Descripción: {cita.descripcion}</p>
        <p>Fecha: {cita.fechaCita}</p>
        <p>Hora: {cita.horaCita}</p>
        <p>Sucursal: {cita.sucursal?.nombre ?? cita.sucursalId}</p>
        <p>Tipo servicio: {cita.tipoServicio?.tipo ?? cita.tipoServicioId}</p>
      </div>
    </>
  );
};

export default CitasDetail;
