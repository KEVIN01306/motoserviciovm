import { Button, Divider, Grid, Modal, Box, Fab } from "@mui/material";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormEstructure from "../../../components/utils/FormEstructure";
import InputsForm from "./InputsForm";
import { type modeloType, modeloInitialState } from "../../../types/modeloType";
import { modeloSchema } from "../../../zod/modelo.schema";
import { postModelo } from "../../../services/modelo.services";
import { errorToast, successToast } from "../../../utils/toast";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";

type ModalModeloCreateProps = {
    onFinish?: () => void;
};

const ModalModeloCreate: React.FC<ModalModeloCreateProps> = ({ onFinish }) => {
    const [open, setOpen] = useState(false);
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<modeloType>({
        resolver: zodResolver(modeloSchema) as unknown as Resolver<modeloType>,
        mode: "onSubmit",
        defaultValues: modeloInitialState,
    });

    const handlerSubmit = async (data: modeloType) => {
        try {
            const response = await postModelo(data);
            successToast(`Modelo creado: ${response?.modelo || data.año}`);
            reset(modeloInitialState);
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
                            <Button type="button" onClick={handleSubmit(handlerSubmit)} variant="contained" color="primary" disabled={isSubmitting} fullWidth>
                                Guardar modelo
                            </Button>
                        </Grid>
                    </FormEstructure>
                </Box>
            </Modal>
        </>
    );
};

export default ModalModeloCreate;
