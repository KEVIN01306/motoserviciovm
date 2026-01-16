import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../../store/useAuthStore';
import FormEstructure from '../../../components/utils/FormEstructure';
import { type ServicioType, ServicioInitialState, ServicioProductoClienteInitialState, type ServicioItemType, type ServicioGetType } from '../../../types/servicioType';
import { getInventarios } from '../../../services/inventario.services';
import { getMotos } from '../../../services/moto.services';
import { getSucursales } from '../../../services/sucursal.services';
import { getUsersClientes, getUsersMecanicos } from '../../../services/users.services';
import { errorToast } from '../../../utils/toast';
import type { TipoServicioGetType } from '../../../types/tipoServicioType';
import type { SucursalType } from '../../../types/sucursalType';
import type { UserGetType } from '../../../types/userType';
import { ModalForm } from '../../Motos/components';
import ModalUserCreate from '../../Users/components/ModalUserCreate';
import MotoSearch from './MotoSearch';
import MotoInfo from './MotoInfo';
import ServicioDataForm from './ServicioDataForm';


type Props = {
  initial?: Partial<ServicioGetType>;
  onSubmit: (payload: Partial<ServicioType> & { imagenesFiles?: File[], firmaEntradaFile?: File }) => Promise<void>;
  submitLabel?: string;
  seHaranVentas?: boolean;
  changeSeHaranVentas? : (value: boolean) => void;
};

// const LOCAL_KEY = 'servicio.create.draft';

const ServicioForm = ({ initial, onSubmit, submitLabel = 'Guardar', seHaranVentas, changeSeHaranVentas }: Props) => {
  const { register, handleSubmit, setValue, formState: { isSubmitting }, watch } = useForm<ServicioType>({ defaultValues: { ...(initial ?? ServicioInitialState) } as any });
  const [productosCliente, setProductosCliente] = useState<Array<{ nombre: string; cantidad: number }>>(initial?.productosCliente ?? []);
  const [productoTmp, setProductoTmp] = useState(ServicioProductoClienteInitialState);
  // const [productosList, setProductosList] = useState<any[]>([]);
  const [imagenesFiles, setImagenesFiles] = useState<File[]>([]);
  const [imagenesMeta, setImagenesMeta] = useState<Array<{ descripcion?: string; preview?: string }>>(initial?.imagenesMeta?.map((m:any) => ({ descripcion: m.descripcion ?? '', preview: undefined })) ?? []);
  const [inventarioItems, setInventarioItems] = useState<any[]>([]);
  const [motosList, setMotosList] = useState<any[]>([]);
  const [motoSedected, setMotoSelected] = useState<any>(initial?.moto ?? null);
  const [placaInput, setPlacaInput] = useState('');
  const [buscandoPlaca, setBuscandoPlaca] = useState(false);
  const [motoNoExiste, setMotoNoExiste] = useState(false);
  const [showModalMoto, setShowModalMoto] = useState(false);
  const [showModalUser, setShowModalUser] = useState(false);
  const [sucursalesList, setSucursalesList] = useState<any[]>([]);
  const [sucursalSelected, setSucursalSelected] = useState<SucursalType | null>(initial?.sucursal ?? null);
  const user = useAuthStore(state => state.user);
  // const [usersList, setUsersList] = useState<any[]>([]);
  const [servicioItems, setServicioItems] = useState<ServicioItemType[]>(initial?.servicioItems ?? []);
  const [tiposServicio, setTiposServicio] = useState<TipoServicioGetType[]>([]);
  const [tipoServicioSelected,setTipoServicioSelected]=useState<TipoServicioGetType|null>(initial?.tipoServicio ? initial.tipoServicio : null);
  const [mecanicos,setMecanicos] = useState<UserGetType[]>([])
  const [mecanicoSelected,setMecanicoSelected] = useState<UserGetType|null>(initial?.mecanico? initial.mecanico : null )
  const [clientes,setClientes] = useState<UserGetType[]>([])
  const [clienteSelected,setClienteSelected] = useState<UserGetType|null>(initial?.cliente? initial.cliente : null )
  // Puede ser File (nuevo) o string (url/base64)
  const [imagenGuardada, setImagenGuardada] = useState<any>(initial?.firmaEntrada ? initial.firmaEntrada : null);
/*


  useEffect(() => {
    const draft = localStorage.getItem(LOCAL_KEY);
    if (draft && !initial) {
      try {
        const parsed = JSON.parse(draft);
        reset(parsed);
        setProductosCliente(parsed.productosCliente ?? []);
        setServicioItems(parsed.servicioItems ?? []);
        setImagenesMeta((parsed.imagenesMeta ?? []).map((m: any) => ({ descripcion: m.descripcion ?? '' })));
      } catch (e) { console.error(e); }
    }
  }, [initial, reset]);
*/

  const getUpdateMotos = async () => {
        const m = await getMotos();
        setMotosList(m);
  }

  const getUpdateClientes = async () => {
        const cl = await getUsersClientes();
        setClientes(cl)
  }
  useEffect(() => {
    (async () => {
      try {
        getUpdateMotos();
        const inv = await getInventarios();
        setInventarioItems(inv);
        const suc = await getSucursales();
        setSucursalesList(suc);
        // Cargar tipos de servicio
        const { getTipos } = await import('../../../services/tipoServicio.services');
        const ts = await getTipos();
        setTiposServicio(ts);
        console.log('Mecanicos loading in ServicioForm', ts);
        const mn = await getUsersMecanicos();
        setMecanicos(mn)
        getUpdateClientes();
        // set default sucursal: prefer `initial.sucursalId`, otherwise use first sucursal of logged user (if any)
        const defaultId = (initial && initial.sucursalId) ? initial.sucursalId : undefined;
        if (defaultId) {
          const foundInit = suc.find((s: any) => Number(s.id) === Number(defaultId));
          if (foundInit) {
            setSucursalSelected(foundInit);
            setValue('sucursalId' as any, foundInit.id);
          }
        } else {
          const userSucArr = Array.isArray(user?.sucursales) ? user!.sucursales : [];
          if (userSucArr.length > 0) {
            const first = userSucArr[0];
            const candidateId = typeof first === 'object' ? first?.id : Number(first);
            const found = suc.find((s: any) => Number(s.id) === Number(candidateId));
            if (found) {
              setSucursalSelected(found);
              setValue('sucursalId' as any, found.id);
            }
          }
        }
        if (initial?.servicioItems && initial.servicioItems.length) {
          setServicioItems(initial.servicioItems as ServicioItemType[]);
        } else if (!servicioItems || servicioItems.length === 0) {
          setServicioItems(inv.map((it: any) => ({ inventarioId: it.id, checked: false, itemName: it.item ?? undefined, itemDescripcion: '' })));
        }

        if (motoSedected && Array.isArray(motoSedected.users) && motoSedected.users.length > 0) {
          setClienteSelected(motoSedected.users[0]);
          setValue('clienteId' as any, motoSedected.users[0].id);
        }
      } catch (e) { console.error(e); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
/*
  useEffect(() => {
    // persist draft: include form values, productosCliente and servicioItems
    const subscription = watch((values) => {
      try {
        const draft = { ...(values ?? {}), productosCliente, servicioItems, imagenesMeta: imagenesMeta.map(m => ({ descripcion: m.descripcion })) } as any;
        localStorage.setItem(LOCAL_KEY, JSON.stringify(draft));
      } catch (e) { console.error(e); }
    });
    return () => subscription.unsubscribe();
  }, [watch, productosCliente, servicioItems, imagenesMeta]);
  */
  const addProductoCliente = () => {
    if (!productoTmp.nombre) return errorToast('Ingrese nombre');
    setProductosCliente(s => [...s, { ...productoTmp }]);
    setProductoTmp(ServicioProductoClienteInitialState);
  };

  const toggleServicioItem = (idx: number, checked: boolean) => {
    setServicioItems(s => s.map((it, i) => i === idx ? { ...it, checked, itemDescripcion: checked ? '' : (it.itemDescripcion ?? '') } : it));
  };

  const updateServicioItem = (idx: number, patch: Partial<ServicioItemType>) => {
    setServicioItems(s => s.map((it, i) => i === idx ? { ...it, ...patch } : it));
  };

  const removeProductoCliente = (idx: number) => setProductosCliente(s => s.filter((_, i) => i !== idx));


  // Handler for ImagenesEditorInput controlled changes
  const handleImagenesChange = (files: File[], metas: Array<{ descripcion?: string; preview?: string }>) => {
    // Clean up old previews
    imagenesMeta.forEach(m => { if (m.preview) URL.revokeObjectURL(m.preview); });
    setImagenesFiles(files);
    setImagenesMeta(metas);
  };

  useEffect(() => {
    return () => {
      // cleanup previews
      imagenesMeta.forEach(m => { if (m.preview) URL.revokeObjectURL(m.preview); });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const internalSubmit = async (data: ServicioType) => {
    const normalizedServicioItems = (servicioItems ?? []).map(it => ({ ...it, itemDescripcion: it.itemDescripcion ?? '', notas: it.notas ?? '' }));
    const payload: Partial<ServicioType> & { imagenesFiles?: File[], firmaEntradaFile?: File } = {
      ...data,
      productosCliente,
      servicioItems: normalizedServicioItems,
      imagenesMeta: imagenesMeta.map(m => ({ descripcion: m.descripcion ?? '' })),
      imagenesFiles,
    };
    if (imagenGuardada) {
      if (imagenGuardada instanceof File) {
        payload.firmaEntradaFile = imagenGuardada;
      } else if (typeof imagenGuardada === 'string' && imagenGuardada.startsWith('data:image')) {
        // Convertir base64 a File
        const arr = imagenGuardada.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        const file = new File([u8arr], 'firma.jpg', { type: mime });
        payload.firmaEntradaFile = file;
      }
    }
    await onSubmit(payload);
  };

  return (
    <FormEstructure handleSubmit={handleSubmit(internalSubmit)} sx={{}}>
      <MotoSearch
        placaInput={placaInput}
        setPlacaInput={setPlacaInput}
        onBuscar={async () => {
          setBuscandoPlaca(true);
          setMotoNoExiste(false);
          const found = motosList.find((m: any) => m.placa === placaInput);
          if (found) {
            setMotoSelected(found);
            setValue('motoId' as any, found.id);
            if (found.users && found.users.length > 0) {
              setClienteSelected(found.users[0]);
              setValue('clienteId' as any, found.users[0].id);
            } else {
              setClienteSelected(null);
              setValue('clienteId' as any, null);
            }
          } else {
            setMotoSelected(null);
            setValue('motoId' as any, null);
            setMotoNoExiste(true);
          }
          setBuscandoPlaca(false);
        }}
        buscandoPlaca={buscandoPlaca}
        motoSedected={motoSedected}
        motoNoExiste={motoNoExiste}
        onCrearMoto={() => setShowModalMoto(true)}
        onCambiarPlaca={() => {
          setMotoSelected(null);
          setValue('motoId' as any, null);
          setClienteSelected(null);
          setValue('clienteId' as any, null);
          setPlacaInput('');
        }}
      />

      {showModalMoto && (
        <ModalForm
          onFinish={async () => {
            setShowModalMoto(false);
            await getUpdateMotos();
            const nueva = motosList.find((m: any) => m.placa === placaInput);
            if (nueva) {
              setMotoSelected(nueva);
              setValue('motoId' as any, nueva.id);
            }
          }}
        />
      )}

      <MotoInfo
        motoSedected={motoSedected}
        onCrearUser={() => setShowModalUser(true)}
      />

      {showModalUser && (
        <ModalUserCreate
          onFinish={async () => {
            setShowModalUser(false);
            // Refrescar motos y buscar la placa para actualizar la moto seleccionada y sus usuarios
            const nuevasMotos = await getMotos();
            setMotosList(nuevasMotos);
            const found = nuevasMotos.find((m: any) => m.placa === placaInput);
            if (found) {
              setMotoSelected(found);
              setValue('motoId' as any, found.id);
              // Si tiene users, seleccionar el primero
              if (found.users && found.users.length > 0) {
                setClienteSelected(found.users[0]);
                setValue('clienteId' as any, found.users[0].id);
              } else {
                setClienteSelected(null);
                setValue('clienteId' as any, null);
              }
            }
          }}
        />
      )}

      {/* El resto del formulario solo si hay moto seleccionada */}
      {motoSedected && (
        <ServicioDataForm
          register={register}
          productosCliente={productosCliente}
          productoTmp={productoTmp}
          setProductoTmp={setProductoTmp}
          addProductoCliente={addProductoCliente}
          removeProductoCliente={removeProductoCliente}
          sucursalesList={sucursalesList}
          sucursalSelected={sucursalSelected}
          setSucursalSelected={setSucursalSelected}
          setValue={setValue}
          mecanicos={mecanicos}
          mecanicoSelected={mecanicoSelected}
          setMecanicoSelected={setMecanicoSelected}
          clientes={motoSedected.users ?? []}
          clienteSelected={clienteSelected}
          setClienteSelected={setClienteSelected}
          tiposServicio={tiposServicio}
          tipoServicioSelected={tipoServicioSelected}
          setTipoServicioSelected={setTipoServicioSelected}
          servicioItems={servicioItems}
          inventarioItems={inventarioItems}
          toggleServicioItem={toggleServicioItem}
          updateServicioItem={updateServicioItem}
          imagenesFiles={imagenesFiles}
          imagenesMeta={imagenesMeta}
          handleImagenesChange={handleImagenesChange}
          seHaranVentas={seHaranVentas}
          changeSeHaranVentas={changeSeHaranVentas}
          isSubmitting={isSubmitting}
          submitLabel={submitLabel}
          imagenGuardada={imagenGuardada}
          setImagenGuardada={setImagenGuardada}
          watch={watch}
        />
      )}
    </FormEstructure>
  );
};

export default ServicioForm;

