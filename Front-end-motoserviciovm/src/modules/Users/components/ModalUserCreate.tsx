import { Button, Divider, Grid, Modal, Box, Fab } from "@mui/material";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormEstructure from "../../../components/utils/FormEstructure";
import InputsForm from "./InputsForm";
import { type UserType } from "../../../types/userType";
import {userSchema} from "../../../zod/user.schema";
import { postUser } from "../../../services/users.services";
import { errorToast, successToast } from "../../../utils/toast";
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from "react";
import { getRoles } from '../../../services/rol.services';
import { getSucursales } from '../../../services/sucursal.services';
import { getMotos } from '../../../services/moto.services';

const userInitialState = {
  primerNombre: '',
  segundoNombre: '',
  primerApellido: '',
  segundoApellido: '',
  email: '',
  telefono: '',
  password: '',
  tipo: '',
  roles: [],
  sucursales: [],
  motos: [],
  estadoId: 1,
};

type ModalUserCreateProps = {
    onFinish?: () => void;
};

const ModalUserCreate: React.FC<ModalUserCreateProps> = ({ onFinish }) => {
    const [open, setOpen] = useState(false);
    const [roles, setRoles] = useState<any[]>([]);
    const [sucursales, setSucursales] = useState<any[]>([]);
    const [motos, setMotos] = useState<any[]>([]);
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        reset,
    } = useForm<UserType>({
        resolver: zodResolver(userSchema) as unknown as Resolver<UserType>,
        mode: "onSubmit",
        defaultValues: userInitialState,
    });

    useEffect(() => {
      getRoles().then(setRoles);
      getSucursales().then(setSucursales);
      getMotos().then(setMotos);
    }, []);

    const handlerSubmit = async (data: UserType) => {
        try {
            const response = await postUser(data);
            successToast("User create: " + response);
            reset(userInitialState);
            setOpen(false);
            if (onFinish) onFinish();
        } catch (err: any) {
            errorToast(err.message);
        }
    };

    return (
        <>
         <Grid size={{ xs: 2, md: 2 }} display={'flex'} flexGrow={1} alignItems={'center'} justifyContent={'end'}>
            <Fab size="small" color="primary" aria-label="add" onClick={() => setOpen(true)}>
              <AddIcon />
            </Fab>
          </Grid>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', p: 0, minWidth: 350, maxWidth: 600, maxHeight: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', p: 1, maxHeight: '90vh', overflowY: 'auto' }}>
                        <FormEstructure handleSubmit={handleSubmit(handlerSubmit)} sx={{boxShadow: 24 }}>
                            <InputsForm register={register} control={control} errors={errors} setValue={setValue} watch={watch} roles={roles} sucursales={sucursales} motos={motos} />
                            <Grid size={12}>
                            </Grid>
                            <Grid size={12}>
                                <Button type="button" onClick={handleSubmit(handlerSubmit)} variant="contained" color="primary" disabled={isSubmitting} fullWidth>
                                    Guardar usuario
                                </Button>
                            </Grid>
                        </FormEstructure>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default ModalUserCreate;
