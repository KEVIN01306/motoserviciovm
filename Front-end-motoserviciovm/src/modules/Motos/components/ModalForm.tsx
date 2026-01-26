import { Button, Divider, Grid, Modal, Box, Fab } from "@mui/material";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormEstructure from "../../../components/utils/FormEstructure";
import { InputsForm } from "../components";
import { MotoInitialState, type motoType } from "../../../types/motoType";
import { motoSchema } from "../../../zod/moto.schema";
import { postMoto } from "../../../services/moto.services";
import { errorToast, successToast } from "../../../utils/toast";
import AddIcon from '@mui/icons-material/Add';


import { useState } from "react";

type ModalMotoCreateProps = {
    onFinish?: () => void;
    placa?: motoType['placa'];
};

const ModalMotoCreate: React.FC<ModalMotoCreateProps> = ({ onFinish,placa }) => {
    const [open, setOpen] = useState(false);
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<motoType>({
        resolver: zodResolver(motoSchema) as unknown as Resolver<motoType>,
        mode: "onSubmit",
        defaultValues: { ...MotoInitialState, placa },
    });

    const handlerSubmit = async (data: motoType) => {
        try {
            const payload = { ...data, estadoId: 1 } as motoType;
            const response = await postMoto(payload);
            successToast(`Moto creada: ${response || payload.placa}`);
            reset({ ...MotoInitialState, placa });
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
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', p: 4, minWidth: 350, maxWidth: 500 }} display={'flex'} justifyContent={'center'}>
                    <FormEstructure handleSubmit={handleSubmit(handlerSubmit)} sx={{boxShadow: 24}}>
                        <InputsForm register={register} control={control} errors={errors} />
                        <Grid size={12}>
                            <Divider sx={{ my: 2 }} />
                        </Grid>
                        <Grid size={12}>
                            <Button
                                type="button"
                                variant="contained"
                                disabled={isSubmitting}
                                fullWidth
                                onClick={handleSubmit(handlerSubmit)}
                            >
                                {isSubmitting ? "Guardando..." : "Crear Moto"}
                            </Button>
                        </Grid>
                    </FormEstructure>
                </Box>
            </Modal>
        </>
    );
};

export default ModalMotoCreate;
